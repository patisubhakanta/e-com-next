import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000

describe("test login and signup ", () => {
    describe("test login", () => {
        it("login sucessfully", async () => {
            const response = await axios.post(`http://localhost:${port}/api/auth/signin`, {
                email: "abc@niku.com",
                password: "abc@niku.com"
            })
            expect(response.status).toBe(200);
            expect(response.data).not.toBeNull();
        });
    })
    describe("test signup", () => {
        it("account created", async () => {
            const response = await axios.post(`http://localhost:${port}/api/auth/signup`, {
                username: Math.random().toString(36).substring(2, 12),
                email: `${Math.random().toString(36).substring(2, 12)}@gmail.com`,
                password: `${Math.random().toString(36).substring(2, 12)}@gmail.com`
            })
            expect(response.status).toBe(201);
            expect(response.data).not.toBeNull();
        });
    })

});
