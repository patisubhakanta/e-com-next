import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000
const token = process.env.TEST_USER_TOKEN || ""
const testProductId =  process.env.TEST_PRODUCT_ID || ""
const testUserId = process.env.TEST_USER_ID

describe("Order routes", () => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    it("should place an order successfully", async () => {
        const response = await axios.post(
            `http://localhost:${port}/api/order`,
            {
                products: [
                    { productId: testProductId, qty: 2, price: 699.99 },
                ]
            },
            config
        );
        expect(response.status).toBe(201);
        expect(response.data.order).not.toBeNull();
        expect(response.data.order.items).toBeInstanceOf(Array);
    });
    it("should retrieve the user's orders successfully", async () => {
        const response = await axios.get(`http://localhost:${port}/api/orders/${testUserId}`);

        expect(response.status).toBe(200);
        expect(response.data.orders).toBeInstanceOf(Array);
    });

});



