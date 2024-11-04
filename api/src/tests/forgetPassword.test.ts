import request from 'supertest';

import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import app from '../server';
import User from '../modals/userModal';

// Mocking the User model
jest.mock('../models/User');

describe('POST /forget-password', () => {
    const userEmail = 'test@example.com';
    const newPassword = 'NewPassword123';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 404 if the user is not found', async () => {
        (User.findOne as jest.Mock).mockResolvedValue(null);
        const response = await request(app).post('/forget-password').send({ email: userEmail, newPassword });
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR.USER_NOT_FOUND);
    });

    it('should return 200 and success message if the password is updated', async () => {
        const mockUser = { email: userEmail, password: 'oldPassword' };
        (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      

        const response = await request(app).post('/forget-password').send({ email: userEmail, newPassword });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(SUCESS_MESSAGE.FORGET_PASSWORD[200]);
    });

    it('should return 500 if there is a server error', async () => {
        (User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));
        const response = await request(app).post('/forget-password').send({ email: userEmail, newPassword });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR[500]);
    });
});
