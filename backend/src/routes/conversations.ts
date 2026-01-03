import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { eq, and, or } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import * as schema from '../db/schema.js';
import type { App } from '../index.js';

interface StartConversationRequest {
  matchedUserId: string;
  opener: string;
}

interface SendMessageRequest {
  content: string;
}

interface ConversationActionRequest {
  action: 'end' | 'snooze';
}

export function registerConversationsRoutes(app: App, fastify: FastifyInstance) {
  const requireAuth = app.requireAuth();

  // Start conversation with required opener (min 36 characters validation)
  fastify.post('/api/conversations/start', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { matchedUserId, opener } = request.body as StartConversationRequest;

    // Validate opener length
    if (!opener || opener.length < 36) {
      return reply.status(400).send({
        error: 'Opener must be at least 36 characters',
        currentLength: opener?.length || 0,
      });
    }

    // Check if conversation already exists
    const existingConversation = await app.db.query.conversations.findFirst({
      where: or(
        and(
          eq(schema.conversations.user1Id, session.user.id),
          eq(schema.conversations.user2Id, matchedUserId)
        ),
        and(
          eq(schema.conversations.user1Id, matchedUserId),
          eq(schema.conversations.user2Id, session.user.id)
        )
      ),
    });

    if (existingConversation) {
      return reply.status(400).send({ error: 'Conversation already exists' });
    }

    // Create conversation
    const conversationId = randomUUID();
    await app.db.insert(schema.conversations).values({
      id: conversationId,
      user1Id: session.user.id,
      user2Id: matchedUserId,
      status: 'active',
    });

    // Send opener message
    const messageId = randomUUID();
    const [message] = await app.db
      .insert(schema.messages)
      .values({
        id: messageId,
        conversationId,
        senderId: session.user.id,
        content: opener,
      })
      .returning();

    // Record the action
    const actionId = randomUUID();
    await app.db.insert(schema.conversationActions).values({
      id: actionId,
      conversationId,
      userId: session.user.id,
      actionType: 'reply',
    });

    return reply.status(201).send({
      success: true,
      conversation: {
        id: conversationId,
        user1Id: session.user.id,
        user2Id: matchedUserId,
        status: 'active',
      },
      initialMessage: message,
    });
  });

  // Get all active conversations
  fastify.get('/api/conversations', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const conversations = await app.db.query.conversations.findMany({
      where: or(
        eq(schema.conversations.user1Id, session.user.id),
        eq(schema.conversations.user2Id, session.user.id)
      ),
      with: {
        user1: true,
        user2: true,
        messages: {
          limit: 1,
          orderBy: (msg) => msg.createdAt,
        },
      },
      orderBy: (conv) => conv.lastMessageAt,
    });

    return {
      success: true,
      conversations: conversations.map((conv) => ({
        ...conv,
        otherUser:
          conv.user1Id === session.user.id ? conv.user2 : conv.user1,
      })),
    };
  });

  // Send message
  fastify.post('/api/conversations/:id/message', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const { content } = request.body as SendMessageRequest;

    if (!content || content.trim().length === 0) {
      return reply.status(400).send({ error: 'Message content is required' });
    }

    // Get conversation
    const conversation = await app.db.query.conversations.findFirst({
      where: eq(schema.conversations.id, id),
    });

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    // Check if user is part of conversation
    if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    // Check if conversation is active
    if (conversation.status !== 'active') {
      return reply.status(400).send({
        error: `Cannot send message to ${conversation.status} conversation`,
      });
    }

    // Send message
    const messageId = randomUUID();
    const [message] = await app.db
      .insert(schema.messages)
      .values({
        id: messageId,
        conversationId: id,
        senderId: session.user.id,
        content,
      })
      .returning();

    // Update conversation lastMessageAt
    await app.db
      .update(schema.conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, id));

    // Record the action
    const actionId = randomUUID();
    await app.db.insert(schema.conversationActions).values({
      id: actionId,
      conversationId: id,
      userId: session.user.id,
      actionType: 'reply',
    });

    return reply.status(201).send({
      success: true,
      message,
    });
  });

  // Get conversation messages
  fastify.get('/api/conversations/:id/messages', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };
    const query = request.query as Record<string, string | undefined>;
    const queryLimit = query.limit;
    const queryOffset = query.offset;
    const limitNum = Math.min(parseInt(queryLimit || '50'), 100);
    const offsetNum = Math.max(0, parseInt(queryOffset || '0'));

    // Get conversation
    const conversation = await app.db.query.conversations.findFirst({
      where: eq(schema.conversations.id, id),
    });

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    // Check if user is part of conversation
    if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    const messages = await app.db.query.messages.findMany({
      where: eq(schema.messages.conversationId, id),
      with: {
        sender: true,
      },
      limit: limitNum,
      offset: offsetNum,
      orderBy: (msg) => msg.createdAt,
    });

    return {
      success: true,
      messages,
    };
  });

  // End conversation
  fastify.post('/api/conversations/:id/end', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };

    // Get conversation
    const conversation = await app.db.query.conversations.findFirst({
      where: eq(schema.conversations.id, id),
    });

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    // Check if user is part of conversation
    if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    // Update conversation status
    const [updatedConversation] = await app.db
      .update(schema.conversations)
      .set({ status: 'ended' })
      .where(eq(schema.conversations.id, id))
      .returning();

    // Record the action
    const actionId = randomUUID();
    await app.db.insert(schema.conversationActions).values({
      id: actionId,
      conversationId: id,
      userId: session.user.id,
      actionType: 'end',
    });

    return {
      success: true,
      conversation: updatedConversation,
    };
  });

  // Snooze conversation
  fastify.post('/api/conversations/:id/snooze', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    const { id } = request.params as { id: string };

    // Get conversation
    const conversation = await app.db.query.conversations.findFirst({
      where: eq(schema.conversations.id, id),
    });

    if (!conversation) {
      return reply.status(404).send({ error: 'Conversation not found' });
    }

    // Check if user is part of conversation
    if (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id) {
      return reply.status(403).send({ error: 'Unauthorized' });
    }

    // Update conversation status
    const [updatedConversation] = await app.db
      .update(schema.conversations)
      .set({ status: 'snoozed' })
      .where(eq(schema.conversations.id, id))
      .returning();

    // Record the action
    const actionId = randomUUID();
    await app.db.insert(schema.conversationActions).values({
      id: actionId,
      conversationId: id,
      userId: session.user.id,
      actionType: 'snooze',
    });

    return {
      success: true,
      conversation: updatedConversation,
    };
  });

  // Get conversations requiring action (reply/end/snooze)
  fastify.get('/api/conversations/pending-actions', async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<any | void> => {
    const session = await requireAuth(request, reply);
    if (!session) return;

    // Get all conversations involving the user
    const conversations = await app.db.query.conversations.findMany({
      where: or(
        eq(schema.conversations.user1Id, session.user.id),
        eq(schema.conversations.user2Id, session.user.id)
      ),
      with: {
        messages: {
          limit: 1,
          orderBy: (msg) => msg.createdAt,
        },
        actions: {
          orderBy: (action) => action.timestamp,
        },
        user1: true,
        user2: true,
      },
    });

    // Filter for conversations that need action from the current user
    const pendingConversations = conversations.filter((conv) => {
      // Get the other user
      const otherUserId =
        conv.user1Id === session.user.id ? conv.user2Id : conv.user1Id;

      // Find last action by other user
      const lastOtherUserAction = conv.actions
        .filter((a) => a.userId === otherUserId)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      // Find last action by current user
      const lastCurrentUserAction = conv.actions
        .filter((a) => a.userId === session.user.id)
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

      // If other user has more recent action, current user should take action
      if (
        lastOtherUserAction &&
        (!lastCurrentUserAction ||
          lastOtherUserAction.timestamp > lastCurrentUserAction.timestamp)
      ) {
        return true;
      }

      return false;
    });

    return {
      success: true,
      count: pendingConversations.length,
      conversations: pendingConversations.map((conv) => ({
        ...conv,
        otherUser:
          conv.user1Id === session.user.id ? conv.user2 : conv.user1,
      })),
    };
  });
}
