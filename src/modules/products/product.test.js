const request = require("supertest");
const app = require('../../app');
const controller = require("./productController");

beforeEach(() => controller.reset());

describe("Product CRUD", () => {
  test("Create product", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Apple", price: 100 });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Apple");
  });

  test("Get all products", async () => {
    await request(app).post("/products").send({ name: "A", price: 10 });
    const res = await request(app).get("/products");
    expect(res.body.length).toBe(1);
  });

  test("Get product by ID", async () => {
    const create = await request(app).post("/products").send({ name: "X", price: 5 });
    const res = await request(app).get(`/products/${create.body.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("X");
  });

  test("Update product", async () => {
    const create = await request(app).post("/products").send({ name: "Old", price: 20 });
    const res = await request(app)
      .put(`/products/${create.body.id}`)
      .send({ name: "New", price: 25 });

    expect(res.body.name).toBe("New");
  });

  test("Delete product", async () => {
    const create = await request(app).post("/products").send({ name: "Del", price: 30 });
    const res = await request(app).delete(`/products/${create.body.id}`);
    expect(res.body.message).toBe("Deleted");
  });
});
