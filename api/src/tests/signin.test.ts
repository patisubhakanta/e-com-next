import request from 'supertest';
import bcrypt from 'bcrypt';
import { ERROR_MESSAGE } from '../constatnts/messages';
import app from '../server';
import User from '../modals/userModal';



// Mocking the User model
jest.mock('../models/User');

describe('POST /signin', () => {
  const validUser = {
    _id: '1',
    email: 'testuser@example.com',
    username: 'testuser',
    password: 'hashedpassword', 
  };
  const validPassword = 'password123';
  const jwtSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeAll(() => {
    process.env.JWT_SECRET = jwtSecret;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email or password is missing', async () => {
    const response = await request(app).post('/signin').send({ email: '' });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(ERROR_MESSAGE.SIGN_IN[400]);
  });

  it('should return 401 if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null);
    const response = await request(app)
      .post('/signin')
      .send({ email: 'nonexistent@example.com', password: validPassword });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGE.SIGN_IN[401]);
  });

  it('should return 401 if password does not match', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(validUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const response = await request(app)
      .post('/signin')
      .send({ email: validUser.email, password: 'wrongpassword' });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe(ERROR_MESSAGE.SIGN_IN[401]);
  });

  it('should return 200 and JWT token if login is successful', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(validUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const response = await request(app)
      .post('/signin')
      .send({ email: validUser.email, password: validPassword });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toEqual({
      id: validUser._id,
      username: validUser.username,
      email: validUser.email,
    });
  });

  it('should return 500 if there is a server error', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Server error'));
    const response = await request(app)
      .post('/signin')
      .send({ email: validUser.email, password: validPassword });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe(ERROR_MESSAGE.COMMON_ERROR[500]);
  });
});
