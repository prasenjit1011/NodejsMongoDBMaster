const controller = require('./productController');

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  controller.reset(); // Clear data before each test
});

describe('Product Controller', () => {
  test('create(): should create a product and return 201', () => {
    const req = { body: { name: 'Apple', price: 100 } };
    const res = createMockResponse();

    controller.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Apple', price: 100 });
  });

  test('getAll(): should return all products', () => {
    controller.create({ body: { name: 'A', price: 10 } }, createMockResponse());
    controller.create({ body: { name: 'B', price: 20 } }, createMockResponse());

    const req = {};
    const res = createMockResponse();

    controller.getAll(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { id: 1, name: 'A', price: 10 },
      { id: 2, name: 'B', price: 20 }
    ]);
  });

  test('getById(): should return product if found', () => {
    controller.create({ body: { name: 'X', price: 50 } }, createMockResponse());

    const req = { params: { id: '1' } };
    const res = createMockResponse();

    controller.getById(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'X', price: 50 });
  });

  test('getById(): should return 404 if not found', () => {
    const req = { params: { id: '99' } };
    const res = createMockResponse();

    controller.getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  test('update(): should update product if found', () => {
    controller.create({ body: { name: 'Old', price: 20 } }, createMockResponse());

    const req = { params: { id: '1' }, body: { name: 'New', price: 30 } };
    const res = createMockResponse();

    controller.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'New', price: 30 });
  });

  test('update(): should return 404 if not found', () => {
    const req = { params: { id: '99' }, body: { name: 'X', price: 10 } };
    const res = createMockResponse();

    controller.update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  test('remove(): should delete product if found', () => {
    controller.create({ body: { name: 'Del', price: 15 } }, createMockResponse());

    const req = { params: { id: '1' } };
    const res = createMockResponse();

    controller.remove(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Deleted' });
  });

  test('remove(): should return 404 if not found', () => {
    const req = { params: { id: '999' } };
    const res = createMockResponse();

    controller.remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
