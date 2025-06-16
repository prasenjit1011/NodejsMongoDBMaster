const request = require('supertest');
const startServer = require('../app');
const { connectToDatabase } = require('../mongo');
const mongoose = require('mongoose');

let app;
let server;

beforeAll(async () => {
  await connectToDatabase();
  app = await startServer();
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await mongoose.disconnect();
});

describe('Vendor Login Tests', () => {
  it('should login successfully', async () => {
    const res = await request(server).post('/auth/login').send({
      username: 'vendor1',
      password: 'secret123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  }, 15000);

  it('should fail with wrong credentials', async () => {
    const res = await request(server).post('/auth/login').send({
      username: 'vendor1',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(401);
  }, 15000);
});
