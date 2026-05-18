import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

describe('Server API', () => {
  describe('GET /api/health', () => {
    it('should return 200 with OK status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Orion CRM API is running');
    });

    it('should return JSON content type', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });
  });

  describe('Middleware', () => {
    it('should handle JSON payloads', async () => {
      const response = await request(app)
        .post('/api/health')
        .send({ test: 'data' })
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });
  });
});
