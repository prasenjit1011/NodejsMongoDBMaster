const request = require('supertest');
const app = require('../../app');
const userModel = require('./user.model');

beforeEach(() => {
  userModel.resetUsers();
});

describe('User CRUD', () => {
  it('should create a user', async () => {
    const res = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('John');
  });

  it('should fetch user by ID', async () => {
    const user = userModel.createUser({ name: 'Jane', email: 'jane@example.com' });
    const res = await request(app).get(`/users/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('jane@example.com');
  });

  it('should update a user', async () => {
    const user = userModel.createUser({ name: 'Jake', email: 'jake@example.com' });
    const res = await request(app)
      .put(`/users/${user.id}`)
      .send({ name: 'Jake Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Jake Updated');
  });

  it('should delete a user', async () => {
    const user = userModel.createUser({ name: 'Jim', email: 'jim@example.com' });
    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.statusCode).toBe(204);
  });

  it('should list all users', async () => {
    userModel.createUser({ name: 'U1', email: 'u1@example.com' });
    userModel.createUser({ name: 'U2', email: 'u2@example.com' });

    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });
});