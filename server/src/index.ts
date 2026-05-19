import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import organizationRoutes from './routes/organizationRoutes';
import contactRoutes from './routes/contactRoutes';
import logger from './logger';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info('HTTP request', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${Date.now() - start}ms`,
    });
  });
  next();
});

// Routes
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Orion CRM API is running' });
});

app.post('/api/logs', (req: Request, res: Response) => {
  const { level, message, ...meta } = req.body;
  logger[level as 'info' | 'warn' | 'error']?.(`[client] ${message}`, meta);
  res.status(204).send();
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/contacts', contactRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn('Route not found', { method: req.method, url: req.originalUrl });
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack, url: req.originalUrl });
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
