const request = require('supertest');
const app = require('../../app');

describe('GraphQL Manager', () => {
  it('creates a new manager', async () => {
    const query = `
      mutation {
        addManager(name: "Dev1", email: "dev1@example.com") {
          id
          name
          email
        }
      }
    `;
    const res = await request(app)
      .post('/graphql')
      .send({ query });

    expect(res.body.data.addManager.name).toBe('Dev1');
  });
});
