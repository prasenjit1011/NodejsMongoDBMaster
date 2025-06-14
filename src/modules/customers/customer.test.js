jest.setTimeout(30000); // ⏱️ Increase timeout to 20s

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Customer = require('./customer.model');
const controller = require('./customer.controller');

let mongoServer;

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};



beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '4.0.27', // ✅ AVX-free MongoDB version
    },
  });

  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});


afterEach(async () => {
  await Customer.deleteMany(); // cleanup test data
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop(); // ✅ prevent undefined error
});

describe('Customer Controller', () => {
    test('create: should create a customer', async () => {
        const req = {
            body: {
              name: 'David',
              email: 'david@test.com',
              age: 30,
            },
          };
      
        const res = mockRes();
    
        await controller.create(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        // expect(res.json).toHaveBeenCalledWith(
        //     expect.objectContaining({
        //         name: 'David',
        //         email: 'david@test.com',
        //         age: 30,
        //     })
        // );
    });
//   test('create: should create a customer', async () => {
//     const req = { body: { name: 'David', email: 'david@test.com' } };
//     const res = mockRes();

//     await controller.create(req, res);

//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
//       name: 'David',
//       email: 'david@test.com'
//     }));
//   });

//   test('getAll: should return all customers', async () => {
//     await Customer.create({ name: 'Alice', email: 'alice@test.com' });

//     const req = {};
//     const res = mockRes();

//     await controller.getAll(req, res);

//     expect(res.json).toHaveBeenCalledWith(
//       expect.arrayContaining([
//         expect.objectContaining({ name: 'Alice', email: 'alice@test.com' })
//       ])
//     );
//   });
});


















// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');
// const Customer = require('./customer.model');

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// }, 15000); // 🔧 increase timeout to 15 seconds

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   if (mongoServer) await mongoServer.stop(); // ✅ prevent 'undefined' error
// });

// afterEach(async () => {
//   await Customer.deleteMany(); // Cleanup
// });

// describe('Customer Model Test', () => {
//   test('should create & save customer successfully', async () => {
//     const customerData = { name: 'Alice', email: 'alice@example.com', age: 30 };
//     const customer = new Customer(customerData);
//     const savedCustomer = await customer.save();

//     expect(savedCustomer._id).toBeDefined();
//     expect(savedCustomer.name).toBe(customerData.name);
//     expect(savedCustomer.email).toBe(customerData.email);
//     expect(savedCustomer.age).toBe(customerData.age);
//   });

//   test('should not save customer without required fields', async () => {
//     const customer = new Customer({ email: 'bob@example.com' }); // name missing

//     let err;
//     try {
//       await customer.save();
//     } catch (error) {
//       err = error;
//     }

//     expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
//     expect(err.errors.name).toBeDefined();
//   });
// });
