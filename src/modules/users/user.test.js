const userController = require('./user.controller');
const userModel = require('./user.model');

// Mock the userModel methods
jest.mock('./user.model');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create(): should create a user and return 201', () => {
    const req = { body: { name: 'John' } };
    const res = mockResponse();

    const fakeUser = { id: 1, name: 'John' };
    userModel.createUser.mockReturnValue(fakeUser);

    userController.create(req, res);

    expect(userModel.createUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
  });

  test('get(): should return user if found', () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    const user = { id: 1, name: 'John' };
    userModel.getUser.mockReturnValue(user);

    userController.get(req, res);

    expect(userModel.getUser).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(user);
  });

  test('get(): should return 404 if user not found', () => {
    const req = { params: { id: '99' } };
    const res = mockResponse();

    userModel.getUser.mockReturnValue(null);

    userController.get(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('update(): should update and return user if found', () => {
    const req = { params: { id: '1' }, body: { name: 'Jane' } };
    const res = mockResponse();

    const updatedUser = { id: 1, name: 'Jane' };
    userModel.updateUser.mockReturnValue(updatedUser);

    userController.update(req, res);

    expect(userModel.updateUser).toHaveBeenCalledWith(1, req.body);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
  });

  test('update(): should return 404 if user not found', () => {
    const req = { params: { id: '99' }, body: {} };
    const res = mockResponse();

    userModel.updateUser.mockReturnValue(null);

    userController.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('remove(): should delete user and return 204', () => {
    const req = { params: { id: '1' } };
    const res = mockResponse();

    userModel.deleteUser.mockReturnValue(true);

    userController.remove(req, res);

    expect(userModel.deleteUser).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  test('remove(): should return 404 if user not found', () => {
    const req = { params: { id: '99' } };
    const res = mockResponse();

    userModel.deleteUser.mockReturnValue(false);

    userController.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  test('list(): should return all users', () => {
    const req = {};
    const res = mockResponse();

    const users = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ];

    userModel.getAllUsers.mockReturnValue(users);

    userController.list(req, res);

    expect(userModel.getAllUsers).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(users);
  });
});




// const request = require('supertest');
// const app = require('../../app');
// const userModel = require('./user.model');

// beforeEach(() => {
//   userModel.resetUsers();
// });

// describe('User CRUD', () => {
//   it('should create a user', async () => {
//     const res = await request(app)
//       .post('/users')
//       .send({ name: 'John', email: 'john@example.com' });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.name).toBe('John');
//   });

//   it('should fetch user by ID', async () => {
//     const user = userModel.createUser({ name: 'Jane', email: 'jane@example.com' });
//     const res = await request(app).get(`/users/${user.id}`);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.email).toBe('jane@example.com');
//   });

//   it('should update a user', async () => {
//     const user = userModel.createUser({ name: 'Jake', email: 'jake@example.com' });
//     const res = await request(app)
//       .put(`/users/${user.id}`)
//       .send({ name: 'Jake Updated' });
//     expect(res.statusCode).toBe(200);
//     expect(res.body.name).toBe('Jake Updated');
//   });

//   it('should delete a user', async () => {
//     const user = userModel.createUser({ name: 'Jim', email: 'jim@example.com' });
//     const res = await request(app).delete(`/users/${user.id}`);
//     expect(res.statusCode).toBe(204);
//   });

//   it('should list all users', async () => {
//     userModel.createUser({ name: 'U1', email: 'u1@example.com' });
//     userModel.createUser({ name: 'U2', email: 'u2@example.com' });

//     const res = await request(app).get('/users');
//     expect(res.statusCode).toBe(200);
//     expect(res.body.length).toBe(2);
//   });
// });