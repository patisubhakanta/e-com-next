import { renderHook, act } from '@testing-library/react-hooks';
import useCheckout from '../useCheckout';
import axios from 'axios';
import { API } from '../../route/Route';
import { IProduct } from '../../types/Types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useCheckout hook', () => {
  const token = 'fake-token';

  beforeEach(() => {
    // Mock sessionStorage.getItem to return the fake token
    Object.defineProperty(sessionStorage, 'getItem', {
      value: jest.fn(() => token),
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a successful request to place an order', async () => {
    const mockProduct: IProduct = {
      _id: '123',
      name: 'Test Product',
      price: 100,
      image: 'test-image.jpg',
      description: 'A test product',
      inStock:true
    };
    const cart = [{ product: mockProduct, quantity: 2 }];

    const mockResponse = {
      message: 'Order placed successfully',
      products: [
        {
          productId: '123',
          qty: 2,
          price: 100,
          productImage: 'test-image.jpg',
        },
      ],
    };

    // Mock axios.post to resolve with the mock response
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useCheckout());

    await act(async () => {
      const response = await result.current.checkout(cart);
      expect(response).toEqual(mockResponse);
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(API.ORDER.PLACE_ORDER, {
      products: [
        {
          productId: '123',
          qty: 2,
          price: 100,
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it('should throw an error if the API request fails', async () => {
    const mockProduct: IProduct = {
      _id: '123',
      name: 'Test Product',
      price: 100,
      image: 'test-image.jpg',
      description: 'A test product',
      inStock:true
    };
    const cart = [{ product: mockProduct, quantity: 2 }];

    const errorMessage = 'Checkout failed';
    mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCheckout());

    await expect(async () => {
      await act(async () => {
        await result.current.checkout(cart);
      });
    }).rejects.toThrowError(errorMessage);

    expect(mockedAxios.post).toHaveBeenCalledWith(API.ORDER.PLACE_ORDER, {
      products: [
        {
          productId: '123',
          qty: 2,
          price: 100,
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it('should throw an error if no token is found in sessionStorage', async () => {
    Object.defineProperty(sessionStorage, 'getItem', {
      value: jest.fn(() => null),
      writable: true,
    });

    const mockProduct: IProduct = {
      _id: '123',
      name: 'Test Product',
      price: 100,
      image: 'test-image.jpg',
      description: 'A test product',
      inStock:true
    };
    const cart = [{ product: mockProduct, quantity: 2 }];

    const { result } = renderHook(() => useCheckout());

    await expect(async () => {
      await act(async () => {
        await result.current.checkout(cart);
      });
    }).rejects.toThrowError();

    expect(mockedAxios.post).not.toHaveBeenCalled();
  });
});
