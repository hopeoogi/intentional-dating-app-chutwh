import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { user } from './auth-schema.js';

// Enums
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);
export const conversationStatusEnum = pgEnum('conversation_status', ['active', 'ended', 'snoozed']);
export const conversationActionTypeEnum = pgEnum('conversation_action_type', ['reply', 'end', 'snooze']);
export const waitlistStatusEnum = pgEnum('waitlist_status', ['pending', 'approved', 'rejected']);

// Extended user profile table
export const userProfile = pgTable('user_profile', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  age: integer('age'),
  city: text('city'),
  bio: text('bio'),
  photos: jsonb('photos').$type<string[]>().default([]).notNull(),
  badges: jsonb('badges').$type<string[]>().default([]).notNull(),
  verified: boolean('verified').default(false).notNull(),
  approved: approvalStatusEnum('approved').default('pending').notNull(),
  lastActive: timestamp('last_active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index('idx_approved').on(table.approved),
  index('idx_verified').on(table.verified),
]);

// Daily matches table
export const dailyMatches = pgTable('daily_matches', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  matchedUserId: text('matched_user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  date: text('date').notNull(), // YYYY-MM-DD format for daily grouping
  viewed: boolean('viewed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_daily_matches_user_date').on(table.userId, table.date),
  index('idx_daily_matches_viewed').on(table.viewed),
]);

// Conversations table
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey(),
  user1Id: text('user1_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  user2Id: text('user2_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: conversationStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  lastMessageAt: timestamp('last_message_at'),
}, (table) => [
  index('idx_conversations_user1').on(table.user1Id),
  index('idx_conversations_user2').on(table.user2Id),
  index('idx_conversations_status').on(table.status),
]);

// Messages table
export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  senderId: text('sender_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  index('idx_messages_conversation').on(table.conversationId),
  index('idx_messages_sender').on(table.senderId),
  index('idx_messages_read').on(table.read),
]);

// Conversation actions table (for tracking reply/end/snooze actions)
export const conversationActions = pgTable('conversation_actions', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  actionType: conversationActionTypeEnum('action_type').notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
}, (table) => [
  index('idx_conversation_actions_conv').on(table.conversationId),
  index('idx_conversation_actions_user').on(table.userId),
  index('idx_conversation_actions_type').on(table.actionType),
]);

// Waitlist applications table
export const waitlistApplications = pgTable('waitlist_applications', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  location: text('location').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  lookingFor: text('looking_for').notNull(),
  additionalInfo: text('additional_info'),
  status: waitlistStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index('idx_waitlist_email').on(table.email),
  index('idx_waitlist_status').on(table.status),
  index('idx_waitlist_created').on(table.createdAt),
]);

// Relations
export const userProfileRelations = relations(userProfile, ({ one, many }) => ({
  user: one(user, {
    fields: [userProfile.userId],
    references: [user.id],
  }),
  sentMatches: many(dailyMatches, {
    relationName: 'userMatches',
  }),
  receivedMatches: many(dailyMatches, {
    relationName: 'matchedUserMatches',
  }),
  user1Conversations: many(conversations, {
    relationName: 'user1Conversations',
  }),
  user2Conversations: many(conversations, {
    relationName: 'user2Conversations',
  }),
  sentMessages: many(messages, {
    relationName: 'senderMessages',
  }),
  conversationActions: many(conversationActions, {
    relationName: 'userActions',
  }),
}));

export const dailyMatchesRelations = relations(dailyMatches, ({ one }) => ({
  user: one(userProfile, {
    fields: [dailyMatches.userId],
    references: [userProfile.userId],
    relationName: 'userMatches',
  }),
  matchedUser: one(userProfile, {
    fields: [dailyMatches.matchedUserId],
    references: [userProfile.userId],
    relationName: 'matchedUserMatches',
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user1: one(userProfile, {
    fields: [conversations.user1Id],
    references: [userProfile.userId],
    relationName: 'user1Conversations',
  }),
  user2: one(userProfile, {
    fields: [conversations.user2Id],
    references: [userProfile.userId],
    relationName: 'user2Conversations',
  }),
  messages: many(messages, {
    relationName: 'conversationMessages',
  }),
  actions: many(conversationActions, {
    relationName: 'conversationActions',
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
    relationName: 'conversationMessages',
  }),
  sender: one(userProfile, {
    fields: [messages.senderId],
    references: [userProfile.userId],
    relationName: 'senderMessages',
  }),
}));

export const conversationActionsRelations = relations(conversationActions, ({ one }) => ({
  conversation: one(conversations, {
    fields: [conversationActions.conversationId],
    references: [conversations.id],
    relationName: 'conversationActions',
  }),
  user: one(userProfile, {
    fields: [conversationActions.userId],
    references: [userProfile.userId],
    relationName: 'userActions',
  }),
}));
