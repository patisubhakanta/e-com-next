import { addItemToWishlistAPI, removeItemFromWishlistAPI } from '../wishlistService';
import axios from 'axios';
import { API } from '../../route/Route';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const  getWithToken = jest.fn(() => "dummy-token");
const  getWithOutToken = jest.fn(() => null);

describe.only('Wishlist API', () => {
  const token = 'dummy-token';
  const productId = '123';

  beforeEach(() => {
    // Mock sessionStorage.getItem to return a fake token
    Object.defineProperty(sessionStorage, 'getItem', {
      value:getWithToken(),
      writable: true,
    });

    // Mock axios to resolve successfully for requests
    mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addItemToWishlistAPI', () => {
    it('should make a successful request to add an item to the wishlist', async () => {
      // Call the function
      const result = await addItemToWishlistAPI(productId);

      // Ensure axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        API.WISHLIST.ADD_WISHLIST,
        { _id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the function resolves correctly
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if no token is found in sessionStorage', async () => {
      // Mock sessionStorage to return null for token
      Object.defineProperty(sessionStorage, 'getItem', {
        value: getWithOutToken(),
        writable: true,
      });

      await expect(addItemToWishlistAPI(productId)).rejects.toThrowError('No token found');
    });

    it('should throw an error if the API request fails', async () => {
      // Mock axios to reject with an error
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Failed to add item to wishlist' } },
      });

      await expect(addItemToWishlistAPI(productId)).rejects.toThrowError(
        'Failed to add item to wishlist'
      );
    });
  });

  describe('removeItemFromWishlistAPI', () => {
    it('should make a successful request to remove an item from the wishlist', async () => {
      // Call the function
      await removeItemFromWishlistAPI(productId);

      // Ensure axios was called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        API.WISHLIST.REMOVEWISHLIST,
        { _id: productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    });

    it('should throw an error if no token is found in sessionStorage', async () => {
      // Mock sessionStorage to return null for token
      Object.defineProperty(sessionStorage, 'getItem', {
        value: getWithOutToken(),
        writable: true,
      });

      await expect(removeItemFromWishlistAPI(productId)).rejects.toThrowError('No token found');
    });

    it('should throw an error if the API request fails', async () => {
      // Mock axios to reject with an error
      mockedAxios.post.mockRejectedValueOnce({
        response: { data: { message: 'Failed to remove item from wishlist' } },
      });

      await expect(removeItemFromWishlistAPI(productId)).rejects.toThrowError(
        'Failed to remove item from wishlist'
      );
    });
  });
});
