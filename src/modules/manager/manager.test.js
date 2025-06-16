const request = require('supertest');
const startServer = require('../../app');
const { connectToDatabase } = require('../../mongo');
const mongoose = require('mongoose'); // 👈 make sure to close DB
let app;
let server;

beforeAll(async () => {
  await connectToDatabase();
  app = await startServer();
  server = app.listen(0); // 👈 start actual server on random port
});

afterAll(async () => {
  if (server) {
    await server.close(); // 👈 close server
  }
  await mongoose.disconnect(); // 👈 close MongoDB connection
});

describe('GraphQL Manager', () => {
  it(
    'creates a new manager',
    async () => {
      const mutation = `
        mutation {
          addManager(name: "Dev1", email: "dev1@example.com") {
            id
            name
            email
          }
        }
      `;

      const res = await request(server)
        .post('/graphql')
        .send({ query: mutation });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.addManager.name).toBe('Dev1');
      expect(res.body.data.addManager.email).toBe('dev1@example.com');
    },
    15000 // timeout
  );
});
