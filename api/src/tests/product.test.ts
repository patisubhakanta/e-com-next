import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { ERROR_MESSAGE } from "../constatnts/messages";
import { PRICE_SORT } from "../constatnts/sort";
import { IProduct } from "../types/Types";
import app from "../server"
import Product from "../modals/productModal";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {} as ConnectOptions);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany();
});


describe("GET /products", () => {
  beforeEach(async () => {
    const products: any = [
      { _id: "1", name: "Product One", price: 1000, inStock: true },
      { _id: "2", name: "Product Two", price: 2000, inStock: false },
      { _id: "3", name: "Product Three", price: 3000, inStock: true },
      { _id: "4", name: "Product Four", price: 4000, inStock: true },
    ];
    await Product.insertMany(products);
  });

  it("should retrieve all products sorted by price low to high", async () => {
    const response = await request(app)
      .get("/products")
      .query({ sort: PRICE_SORT.LOW_TO_HIGH });

    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBe(4);
    expect(response.body.products[0].price).toBe(1000);
    expect(response.body.products[3].price).toBe(4000);
  });

  it("should retrieve all products sorted by price high to low", async () => {
    const response = await request(app)
      .get("/products")
      .query({ sort: PRICE_SORT.HIGH_TO_LOW });

    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBe(4);
    expect(response.body.products[0].price).toBe(4000);
    expect(response.body.products[3].price).toBe(1000);
  });

  it("should retrieve products matching a search term and recommended products", async () => {
    const response = await request(app)
      .get("/products")
      .query({ search: "Product-One" });

    expect(response.statusCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);
    expect(response.body.products[0].name).toContain("Product One");

    if (response.body.recommend.length > 0) {
      const avgPrice = response.body.products.reduce((acc: number, p: IProduct) => acc + p.price, 0) / response.body.products.length;
      response.body.recommend.forEach((product: IProduct) => {
        expect(product.price).toBeGreaterThanOrEqual(avgPrice - 5000);
        expect(product.price).toBeLessThanOrEqual(avgPrice + 5000);
      });
    }
  });

  it("should return 404 if no products match the search term", async () => {
    const response = await request(app)
      .get("/products")
      .query({ search: "Nonexistent Product" });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND);
  });

  it("should return a 500 error on server error", async () => {
    jest.spyOn(Product, "find").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/products");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR[500]);
  });
});
