import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000
const token = process.env.TEST_USER_TOKEN || ""
const testProductId =  process.env.TEST_PRODUCT_ID || ""

describe("Wishlist routes", () => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    it("should successfully add a product to the user's wishlist", async () => {
        const response = await axios.post(`http://localhost:${port}/api/wishlist/add`,
            { _id: testProductId }, config
        );

        expect(response.status).toBe(201);
    });
    it("should retrieve the user's wishlist successfully", async () => {
        const response = await axios.get(`http://localhost:${port}/api/wishlist`, config);

        expect(response.status).toBe(200);
        expect(response.data).toBeInstanceOf(Array);
    });
    it("should successfully remove a product to the user's wishlist", async () => {
        const response = await axios.post(`http://localhost:${port}/api/wishlist/remove`,
            { _id: testProductId }, config
        );

        expect(response.status).toBe(200);
    });
});



