import { createApplication } from "@specific-dev/framework";
import * as appSchema from './db/schema.js';
import * as authSchema from './db/auth-schema.js';

// Import route registration functions
import { registerProfileRoutes } from './routes/profile.js';
import { registerMatchesRoutes } from './routes/matches.js';
import { registerConversationsRoutes } from './routes/conversations.js';
import { registerAdminRoutes } from './routes/admin.js';

// Combine both schemas (app schema + auth schema)
const schema = { ...appSchema, ...authSchema };

// Create application with combined schema for full database type support
export const app = await createApplication(schema);

// Export App type for use in route files
export type App = typeof app;

// Enable authentication with Better Auth (supports email/password, Google OAuth, Apple OAuth)
app.withAuth();

// Enable storage for file uploads
app.withStorage();

// Register routes - IMPORTANT: Always use registration functions to avoid circular dependency issues
registerProfileRoutes(app, app.fastify);
registerMatchesRoutes(app, app.fastify);
registerConversationsRoutes(app, app.fastify);
registerAdminRoutes(app, app.fastify);

// Health check endpoint
app.fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

await app.run();
app.logger.info('Dating app backend running with authentication enabled');
