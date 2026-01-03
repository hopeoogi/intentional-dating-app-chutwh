import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

interface CreateProfileRequest {
  age?: number;
  city?: string;
  bio?: string;
}

interface UpdateProfileRequest {
  age?: number;
  city?: string;
  bio?: string;
  badges?: string[];
}

export function registerProfileRoutes(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Create user profile with photo upload
  fastify.post('/api/profile/create', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { age, city, bio } = await request.body as CreateProfileRequest;
    const userId = session.user.id;

    // Handle photo upload
    const photos: string[] = [];
    const data = await request.file({ limits: { fileSize: 5 * 1024 * 1024 } });

    if (data) {
      try {
        const buffer = await data.toBuffer();
        const key = `profiles/${userId}/${Date.now()}-${data.filename}`;
        const uploadedKey = await app.storage.upload(key, buffer);
        const { url } = await app.storage.getSignedUrl(uploadedKey);
        photos.push(url);
      } catch (err) {
        if ((err as any).message?.includes('too large')) {
          return reply.status(413).send({ error: 'File too large' });
        }
        throw err;
      }
    }

    try {
      const [profile] = await app.db
        .insert(schema.userProfile)
        .values({
          userId,
          age,
          city,
          bio,
          photos,
          verified: false,
          approved: 'pending',
        })
        .returning();

      return reply.status(201).send({
        success: true,
        profile,
      });
    } catch (err) {
      // Profile already exists
      if ((err as any).code === '23505') {
        return reply.status(400).send({ error: 'Profile already exists' });
      }
      throw err;
    }
  });

  // Update user profile with photo upload
  fastify.put('/api/profile/update', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { age, city, bio, badges } = await request.body as UpdateProfileRequest;
    const userId = session.user.id;

    // Get current profile
    const currentProfile = await app.db.query.userProfile.findFirst({
      where: eq(schema.userProfile.userId, userId),
    });

    if (!currentProfile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    // Handle photo upload
    let photos = currentProfile.photos;
    const data = await request.file({ limits: { fileSize: 5 * 1024 * 1024 } });

    if (data) {
      try {
        const buffer = await data.toBuffer();
        const key = `profiles/${userId}/${Date.now()}-${data.filename}`;
        const uploadedKey = await app.storage.upload(key, buffer);
        const { url } = await app.storage.getSignedUrl(uploadedKey);
        photos = [...photos, url];
      } catch (err) {
        if ((err as any).message?.includes('too large')) {
          return reply.status(413).send({ error: 'File too large' });
        }
        throw err;
      }
    }

    const [updatedProfile] = await app.db
      .update(schema.userProfile)
      .set({
        age: age ?? currentProfile.age,
        city: city ?? currentProfile.city,
        bio: bio ?? currentProfile.bio,
        photos,
        badges: badges ?? currentProfile.badges,
      })
      .where(eq(schema.userProfile.userId, userId))
      .returning();

    return {
      success: true,
      profile: updatedProfile,
    };
  });

  // Get current user profile
  fastify.get('/api/profile/me', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const profile = await app.db.query.userProfile.findFirst({
      where: eq(schema.userProfile.userId, session.user.id),
    });

    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    return {
      success: true,
      profile,
    };
  });
}
