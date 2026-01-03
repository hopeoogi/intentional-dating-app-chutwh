import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

interface WaitlistApplicationRequest {
  name: string;
  age: number;
  location: string;
  email: string;
  phone?: string;
  lookingFor: string;
  additionalInfo?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function registerWaitlistRoutes(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Public POST endpoint for waitlist applications
  fastify.post('/api/waitlist/apply', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const body = request.body as WaitlistApplicationRequest;

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'name',
        message: 'Name is required and must be a non-empty string',
      });
    }

    if (body.age === undefined || typeof body.age !== 'number') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'age',
        message: 'Age is required and must be a number',
      });
    }

    if (body.age < 18) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'age',
        message: 'Age must be 18 or older',
      });
    }

    if (!body.location || typeof body.location !== 'string' || body.location.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'location',
        message: 'Location is required and must be a non-empty string',
      });
    }

    if (!body.email || typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email)) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'email',
        message: 'Email is required and must be a valid email address',
      });
    }

    if (!body.lookingFor || typeof body.lookingFor !== 'string' || body.lookingFor.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'lookingFor',
        message: 'lookingFor is required and must be a non-empty string',
      });
    }

    // Validate optional phone field if provided
    if (body.phone !== undefined && typeof body.phone !== 'string') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'phone',
        message: 'Phone must be a string',
      });
    }

    // Validate optional additionalInfo field if provided
    if (body.additionalInfo !== undefined && typeof body.additionalInfo !== 'string') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'additionalInfo',
        message: 'additionalInfo must be a string',
      });
    }

    try {
      const applicationId = randomUUID();
      const [application] = await app.db
        .insert(schema.waitlistApplications)
        .values({
          id: applicationId,
          name: body.name.trim(),
          age: body.age,
          location: body.location.trim(),
          email: body.email.toLowerCase().trim(),
          phone: body.phone?.trim(),
          lookingFor: body.lookingFor.trim(),
          additionalInfo: body.additionalInfo?.trim(),
          status: 'pending',
        })
        .returning();

      return reply.status(201).send({
        success: true,
        message: 'Application submitted successfully',
        applicationId: application.id,
        status: application.status,
      });
    } catch (err) {
      // Handle unique constraint violation on email
      if ((err as any).code === '23505') {
        return reply.status(409).send({
          error: 'Conflict',
          field: 'email',
          message: 'An application with this email already exists',
        });
      }
      throw err;
    }
  });

  // Protected admin GET endpoint for waitlist applications with pagination
  fastify.get('/api/waitlist/applications', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const query = request.query as Record<string, string | undefined>;
    const pageStr = query.page;
    const limitStr = query.limit;
    const status = query.status;

    const page = Math.max(1, parseInt(pageStr || '1'));
    const limit = Math.min(Math.max(1, parseInt(limitStr || '20')), 100);
    const offset = (page - 1) * limit;

    try {
      // Build where clause
      let whereClause: any = undefined;
      if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        whereClause = eq(schema.waitlistApplications.status, status as 'pending' | 'approved' | 'rejected');
      }

      // Get total count
      const countResult = whereClause
        ? await app.db
            .select()
            .from(schema.waitlistApplications)
            .where(whereClause)
        : await app.db.select().from(schema.waitlistApplications);

      const total = countResult.length;

      // Get paginated results
      let query_result = app.db
        .select()
        .from(schema.waitlistApplications)
        .limit(limit)
        .offset(offset)
        .orderBy((app) => app.createdAt);

      if (whereClause) {
        query_result = query_result.where(whereClause) as any;
      }

      const applications = await query_result;

      return {
        success: true,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        applications,
      };
    } catch (err) {
      app.logger.error({ err }, 'Error fetching waitlist applications');
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'Failed to fetch waitlist applications',
      });
    }
  });

  // Protected admin POST endpoint to update application status
  fastify.post('/api/waitlist/applications/:id/status', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'status',
        message: 'Status must be one of: pending, approved, rejected',
      });
    }

    const application = await app.db.query.waitlistApplications.findFirst({
      where: eq(schema.waitlistApplications.id, id),
    });

    if (!application) {
      return reply.status(404).send({
        error: 'Not found',
        message: 'Waitlist application not found',
      });
    }

    const [updated] = await app.db
      .update(schema.waitlistApplications)
      .set({ status: status as 'pending' | 'approved' | 'rejected' })
      .where(eq(schema.waitlistApplications.id, id))
      .returning();

    return {
      success: true,
      message: `Application status updated to ${status}`,
      application: updated,
    };
  });
}
