import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from './config';
import publicRoutes from './routes/public';
import messagesRoutes from './routes/messages';
import adminRoutes from './routes/admin';

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no Origin header (curl, health checks, same-origin)
      if (!origin || config.clientOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  }),
);
app.use(express.json({ limit: '1mb' }));

// ── Health check (used by Render/Railway and uptime monitors) ─────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', publicRoutes);
app.use('/api', messagesRoutes);
app.use('/api', adminRoutes);

// ── 404 for unknown API paths ─────────────────────────────────────────────────
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Central error handler (CORS rejections, JSON parse errors, throws) ────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[error]', err.message);
  const status = err.message.includes('CORS') ? 403 : 500;
  res.status(status).json({ error: config.isProduction ? 'Internal server error' : err.message });
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
  console.log(`Allowed origins: ${config.clientOrigins.join(', ')}`);
});

export default app;
