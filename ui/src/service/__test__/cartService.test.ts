import axios from 'axios';
import { addItemsToCart } from '../cartService';
import { API } from '@/route/Route';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Cart Service', () => {
  const token = 'fake-token';
  const mockCartItem = {
    productId: '123',
    quantity: 2,
  };

  beforeEach(() => {
    // Mock sessionStorage.getItem using Object.defineProperty
    Object.defineProperty(sessionStorage, 'getItem', {
      value: jest.fn(() => token), // Mock the getItem method to return the fake token
      writable: true,
    });

    // Mock axios to resolve successfully for requests
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItemsToCart', () => {
    it('should make a successful request to add items to the cart', async () => {
      // Ensure the function behaves as expected
      await expect(addItemsToCart([mockCartItem])).resolves.not.toThrow();

      // Check if the post request was called with correct URL and headers
      expect(mockedAxios.post).toHaveBeenCalledWith(API.CART.ADD, { items: [mockCartItem] }, {
        headers: {
          Authorization: `Bearer ${token}`, // It should use the fake token here
        },
      });
    });

    it('should throw an error when the request fails', async () => {
      // Mock axios.post to reject with an error
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Failed to add items to cart' } },
      });

      await expect(addItemsToCart([mockCartItem])).rejects.toThrowError('Failed to add items to cart');
    });

    it('should throw a default error if the error message is missing', async () => {
      // Mock axios.post to reject without a message
      mockedAxios.post.mockRejectedValueOnce({});

      await expect(addItemsToCart([mockCartItem])).rejects.toThrowError('Failed to add items to cart');
    });
  });
});
