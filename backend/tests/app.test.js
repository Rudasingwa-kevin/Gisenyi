const request = require('supertest');
const app = require('../src/app');

describe('App', () => {
  describe('GET /health', () => {
    it('returns ok status', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('db');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/places', () => {
    it('returns an array', async () => {
      const res = await request(app).get('/api/places');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/categories', () => {
    it('returns an array', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/events', () => {
    it('returns an array', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('GET /api/calendar', () => {
    it('returns an array', async () => {
      const res = await request(app).get('/api/calendar');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/feedback', () => {
    it('rejects empty body', async () => {
      const res = await request(app).post('/api/feedback').send({});
      expect(res.status).toBe(400);
    });

    it('rejects missing message', async () => {
      const res = await request(app).post('/api/feedback').send({ name: 'Test' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login with wrong creds', () => {
    it('returns 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'wrong', password: 'wrong' });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/admin/places without auth', () => {
    it('returns 401', async () => {
      const res = await request(app).get('/api/admin/places');
      expect(res.status).toBe(401);
    });
  });
});
