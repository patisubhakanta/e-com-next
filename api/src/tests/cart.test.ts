import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000
const token = process.env.TEST_USER_TOKEN || ""
const testProductId =  process.env.TEST_PRODUCT_ID || ""



describe("Cart routes", () => {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        it("should add new items to cart", async () => {
            const response = await axios.post(
                `http://localhost:${port}/api/cart/add`,
                {
                    items: [
                        { productId: testProductId, quantity: 2 },
                    ]
                },
                config
            );
            expect(response.status).toBe(201);
            expect(response.data.items).not.toBeNull;
        });
        it("should decrease the quantity of a product in the cart", async () => {
            const response = await axios.post(
                `http://localhost:${port}/api/cart/remove`,
                { productId: testProductId },
                config
            );
            expect(response.status).toBe(200);
        });
        it("should retrieve full cart details successfully", async () => {
            const response = await axios.get(
              `http://localhost:${port}/api/cart/items`,
              config
            );
            expect(response.status).toBe(200);
            expect(response.data.cart).toBeInstanceOf(Array);
          });


    });



