import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

interface WaitlistApplicationRequest {
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  provinceState: string;
  country: string;
  email: string;
  phone?: string;
  lookingFor: string[];
  additionalInfo?: string;
}

interface UpdateStatusRequest {
  status: string;
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

    // Validate firstName
    if (!body.firstName || typeof body.firstName !== 'string' || body.firstName.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'firstName',
        message: 'firstName is required and must be a non-empty string',
      });
    }

    // Validate lastName
    if (!body.lastName || typeof body.lastName !== 'string' || body.lastName.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'lastName',
        message: 'lastName is required and must be a non-empty string',
      });
    }

    // Validate age
    if (body.age === undefined || typeof body.age !== 'number') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'age',
        message: 'Age is required and must be a number',
      });
    }

    if (!Number.isInteger(body.age) || body.age < 18) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'age',
        message: 'Age must be at least 18 years old',
      });
    }

    // Validate city
    if (!body.city || typeof body.city !== 'string' || body.city.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'city',
        message: 'City is required and must be a non-empty string',
      });
    }

    // Validate provinceState
    if (!body.provinceState || typeof body.provinceState !== 'string' || body.provinceState.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'provinceState',
        message: 'provinceState is required and must be a non-empty string',
      });
    }

    // Validate country
    if (!body.country || typeof body.country !== 'string' || body.country.trim() === '') {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'country',
        message: 'Country is required and must be a non-empty string',
      });
    }

    // Validate email
    if (!body.email || typeof body.email !== 'string' || !EMAIL_REGEX.test(body.email)) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'email',
        message: 'Email is required and must be a valid email address',
      });
    }

    // Validate lookingFor (must be array with 1-5 items)
    if (!Array.isArray(body.lookingFor) || body.lookingFor.length === 0 || body.lookingFor.length > 5) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'lookingFor',
        message: 'lookingFor is required and must be an array with 1-5 items',
      });
    }

    // Validate all items in lookingFor are strings
    if (!body.lookingFor.every((item) => typeof item === 'string' && item.trim() !== '')) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'lookingFor',
        message: 'All items in lookingFor must be non-empty strings',
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
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(),
          age: body.age,
          city: body.city.trim(),
          provinceState: body.provinceState.trim(),
          country: body.country.trim(),
          email: body.email.toLowerCase().trim(),
          phone: body.phone?.trim(),
          lookingFor: body.lookingFor.map((item) => item.trim()),
          additionalInfo: body.additionalInfo?.trim(),
          status: 'pending',
        })
        .returning();

      return reply.status(201).send({
        success: true,
        message: 'Application submitted successfully',
        application: {
          id: application.id,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          status: application.status,
          createdAt: application.createdAt,
        },
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
      app.logger.error({ err }, 'Error creating waitlist application');
      throw err;
    }
  });

  // Protected admin GET endpoint for waitlist applications with pagination
  fastify.get('/api/admin/waitlist', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const query = request.query as Record<string, string | undefined>;
    const statusFilter = query.status;
    const limitStr = query.limit || '100';
    const offsetStr = query.offset || '0';

    const limit = Math.min(Math.max(1, parseInt(limitStr)), 200);
    const offset = Math.max(0, parseInt(offsetStr));

    try {
      // Build where clause
      let whereClause: any = undefined;
      if (statusFilter && ['pending', 'approved', 'rejected'].includes(statusFilter)) {
        whereClause = eq(schema.waitlistApplications.status, statusFilter as 'pending' | 'approved' | 'rejected');
      }

      // Get total count
      let countQuery = app.db.select().from(schema.waitlistApplications);
      if (whereClause) {
        countQuery = countQuery.where(whereClause) as any;
      }
      const countResult = await countQuery;
      const total = countResult.length;

      // Get paginated results, sorted by createdAt descending
      let applicationsQuery = app.db
        .select()
        .from(schema.waitlistApplications)
        .orderBy(desc(schema.waitlistApplications.createdAt))
        .limit(limit)
        .offset(offset);

      if (whereClause) {
        applicationsQuery = applicationsQuery.where(whereClause) as any;
      }

      const applications = await applicationsQuery;

      return reply.status(200).send({
        success: true,
        pagination: {
          limit,
          offset,
          total,
        },
        applications,
      });
    } catch (err) {
      app.logger.error({ err }, 'Error fetching waitlist applications');
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'Failed to fetch waitlist applications',
      });
    }
  });

  // Protected admin PATCH endpoint to update application status
  fastify.patch('/api/admin/waitlist/:id', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const body = request.body as UpdateStatusRequest;

    // Validate status
    if (!body.status || !['pending', 'approved', 'rejected'].includes(body.status)) {
      return reply.status(400).send({
        error: 'Validation error',
        field: 'status',
        message: 'Status must be one of: pending, approved, rejected',
      });
    }

    try {
      // Check if application exists
      const application = await app.db.query.waitlistApplications.findFirst({
        where: eq(schema.waitlistApplications.id, id),
      });

      if (!application) {
        return reply.status(404).send({
          error: 'Not found',
          message: 'Waitlist application not found',
        });
      }

      // Update status
      const [updated] = await app.db
        .update(schema.waitlistApplications)
        .set({ status: body.status as 'pending' | 'approved' | 'rejected' })
        .where(eq(schema.waitlistApplications.id, id))
        .returning();

      return reply.status(200).send({
        success: true,
        message: `Application status updated to ${body.status}`,
        application: updated,
      });
    } catch (err) {
      app.logger.error({ err }, 'Error updating waitlist application status');
      return reply.status(500).send({
        error: 'Internal server error',
        message: 'Failed to update application status',
      });
    }
  });
}
