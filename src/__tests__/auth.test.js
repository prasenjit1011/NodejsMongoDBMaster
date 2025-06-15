const request = require('supertest');
const app = require('../app');

describe('Vendor Login Tests', () => {
  it('should login successfully', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'vendor1',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail with wrong credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      username: 'vendor1',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(401);
  });
});
