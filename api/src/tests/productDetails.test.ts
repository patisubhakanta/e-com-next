import request from 'supertest';

import { ERROR_MESSAGE } from '../constatnts/messages';
import app from '../server';
import Product from '../modals/productModal';

// Mocking the Product model
jest.mock('../models/Product');

describe('GET /product/:id', () => {
    const productId = '67017806218b101bc5a2bf37';
    const mockProduct = {
        _id: productId,
        name: 'Samsung Galaxy S21',
        price:
            71999,
        description: 'Samsung Galaxy S21 5G with 64MP Camera, 8GB RAM, and 128GB Storage.',
        inStock: true,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if the product is not found', async () => {
        (Product.findById as jest.Mock).mockResolvedValue(null);
        const response = await request(app).get(`/product/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND);
    });

    it('should return 200 and the product details if found', async () => {
        (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
        const response = await request(app).get(`/product/${productId}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockProduct);
    });

    it('should return 500 if there is a server error', async () => {
        (Product.findById as jest.Mock).mockRejectedValue(new Error('Server error'));
        const response = await request(app).get(`/product/${productId}`);
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR[500]);
    });
});
