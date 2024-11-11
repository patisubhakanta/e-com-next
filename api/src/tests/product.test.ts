import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000

describe("test products and product details ", () => {
    describe("GET /products", () => {
        it("products sucessfully", async () => {
            const response = await axios.get(`http://localhost:${port}/api/products`)
            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
        });
    })
    describe("GET /product/:id", () => {
        it("get product sucessfully", async () => {
            const response = await axios.get(`http://localhost:${port}/api/product/67317995d5bc372ef78109d4`)
            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
        });
    })

});
