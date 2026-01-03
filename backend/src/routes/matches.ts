import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and } from 'drizzle-orm';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

export function registerMatchesRoutes(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Get daily matches (limit 10 per day)
  fastify.get('/api/matches/daily', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Get today's matches for user
    const matches = await app.db.query.dailyMatches.findMany({
      where: and(
        eq(schema.dailyMatches.userId, session.user.id),
        eq(schema.dailyMatches.date, today)
      ),
      with: {
        matchedUser: {
          with: {
            user: true,
          },
        },
      },
      limit: 10,
    });

    return {
      success: true,
      count: matches.length,
      matches: matches.map((m) => ({
        id: m.id,
        userId: m.matchedUserId,
        profile: m.matchedUser,
        viewed: m.viewed,
      })),
    };
  });

  // Mark match as viewed
  fastify.post('/api/matches/:matchId/view', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { matchId } = request.params as { matchId: string };

    const match = await app.db.query.dailyMatches.findFirst({
      where: eq(schema.dailyMatches.id, matchId),
    });

    if (!match) {
      return reply.status(404).send({ error: 'Match not found' });
    }

    if (match.userId !== session.user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const [updatedMatch] = await app.db
      .update(schema.dailyMatches)
      .set({ viewed: true })
      .where(eq(schema.dailyMatches.id, matchId))
      .returning();

    return {
      success: true,
      match: updatedMatch,
    };
  });
}
