import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function registerAdminRoutes(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Admin middleware - check if user is admin (basic check - can be enhanced with role system)
  const isAdmin = async (
    session: any
  ): Promise<boolean> => {
    // In production, you'd check a roles table or a roles field
    // For now, we'll use a simple environment variable check
    return session?.user?.email === process.env.ADMIN_EMAIL;
  };

  // Get users pending approval
  fastify.get('/api/admin/pending-approvals', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    if (!(await isAdmin(session))) {
      return reply.status(403).send({ error: 'Unauthorized - Admin only' });
    }

    const pendingUsers = await app.db.query.userProfile.findMany({
      where: eq(schema.userProfile.approved, 'pending'),
      with: {
        user: true,
      },
    });

    return {
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    };
  });

  // Approve user
  fastify.post('/api/admin/approve/:userId', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    if (!(await isAdmin(session))) {
      return reply.status(403).send({ error: 'Unauthorized - Admin only' });
    }

    const { userId } = request.params as { userId: string };

    // Get user profile
    const userProfile = await app.db.query.userProfile.findFirst({
      where: eq(schema.userProfile.userId, userId),
    });

    if (!userProfile) {
      return reply.status(404).send({ error: 'User profile not found' });
    }

    // Update approval status
    const [updatedProfile] = await app.db
      .update(schema.userProfile)
      .set({ approved: 'approved' })
      .where(eq(schema.userProfile.userId, userId))
      .returning();

    return {
      success: true,
      message: `User ${userId} has been approved`,
      profile: updatedProfile,
    };
  });

  // Reject user
  fastify.post('/api/admin/reject/:userId', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    if (!(await isAdmin(session))) {
      return reply.status(403).send({ error: 'Unauthorized - Admin only' });
    }

    const { userId } = request.params as { userId: string };

    // Get user profile
    const userProfile = await app.db.query.userProfile.findFirst({
      where: eq(schema.userProfile.userId, userId),
    });

    if (!userProfile) {
      return reply.status(404).send({ error: 'User profile not found' });
    }

    // Update approval status
    const [updatedProfile] = await app.db
      .update(schema.userProfile)
      .set({ approved: 'rejected' })
      .where(eq(schema.userProfile.userId, userId))
      .returning();

    return {
      success: true,
      message: `User ${userId} has been rejected`,
      profile: updatedProfile,
    };
  });
}
