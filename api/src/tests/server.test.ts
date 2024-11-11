import axios from "axios";

require('dotenv').config();

const port = process.env.PORT || 5000


describe("GET /", () => {
  it("should return 'Welcome to the homepage!", async () => {
    const response = await axios.get(`http://localhost:${port}/`)
    expect(response.status).toBe(200);
    expect(response.data).toBe("Welcome to the homepage!");
  });
});