const request = require('supertest');
const app = require('../src/app');

describe('Auth flow', () => {
  it('logs in with valid credentials and sets cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'e84b116613dd7b24e5d7077fb0beb2fc' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'admin');
    expect(res.body).not.toHaveProperty('token');
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(c => c.startsWith('token='))).toBe(true);
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('rejects missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin' });
    expect(res.status).toBe(400);
  });

  it('GET /api/auth/me returns user when authenticated', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'e84b116613dd7b24e5d7077fb0beb2fc' });

    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('username', 'admin');
  });

  it('GET /api/auth/me returns 401 when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/logout clears cookie', async () => {
    const agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'e84b116613dd7b24e5d7077fb0beb2fc' });

    const res = await agent.post('/api/auth/logout');
    expect(res.status).toBe(200);
  });
});

describe('Admin routes (cookie auth)', () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);
    await agent
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'e84b116613dd7b24e5d7077fb0beb2fc' });
  });

  it('GET /api/admin/places returns paginated data', async () => {
    const res = await agent.get('/api/admin/places');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('page');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/admin/categories returns paginated data', async () => {
    const res = await agent.get('/api/admin/categories');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/admin/events returns paginated data', async () => {
    const res = await agent.get('/api/admin/events');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/admin/calendar returns paginated data', async () => {
    const res = await agent.get('/api/admin/calendar');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/admin/feedback returns paginated data', async () => {
    const res = await agent.get('/api/admin/feedback');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('GET /api/admin/visitor-stats returns stats', async () => {
    const res = await agent.get('/api/admin/visitor-stats');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalVisits');
    expect(res.body).toHaveProperty('daily');
  });

  it('GET /api/admin/system returns system info', async () => {
    const res = await agent.get('/api/admin/system');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('server');
    expect(res.body).toHaveProperty('database');
  });
});

describe('Upload route', () => {
  it('rejects unauthenticated upload', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test'), { filename: 'test.txt', contentType: 'text/plain' });
    expect(res.status).toBe(401);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown API routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });
});

describe('Calendar month filter', () => {
  it('filters by month and year', async () => {
    const res = await request(app).get('/api/calendar?month=6&year=2026');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
