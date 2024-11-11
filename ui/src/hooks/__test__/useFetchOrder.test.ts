import { renderHook, act } from '@testing-library/react-hooks';
import useFetchOrder from '../useFetchOrder';
import axios from 'axios';
import { OrdersResponse, Order, OrderProductDTO, IProduct } from '@/types/Types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useFetchOrder', () => {
    const userId = '12345';
    const token = 'mockToken';

    const mockProduct: IProduct = {
        _id: 'product1',
        name: 'Product 1',
        price: 50,
        inStock: true,
        qty: 2,
        productId: 'prod123',
    };

    const mockOrderProductDTO: OrderProductDTO = {
        orders: [mockProduct],
        timestamp: '2024-11-10T10:00:00Z',
    };

    const mockOrder: Order = {
        userId,
        items: [mockOrderProductDTO],
    };

    const mockResponseData: OrdersResponse = {
        orders: [mockOrder],
        username: 'testUser',
    };

    beforeEach(() => {
        // Set up localStorage and sessionStorage mocks
        localStorage.setItem('userId', userId);
        sessionStorage.setItem('token', token);
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
        sessionStorage.clear();
    });

    test('fetches order data successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData });

        const { result, waitForNextUpdate } = renderHook(() => useFetchOrder());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Data should be set correctly
        expect(result.current.data).toEqual(mockResponseData);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    test('sets error if userId or token is missing', async () => {
        // Clear the userId and token
        localStorage.removeItem('userId');
        sessionStorage.removeItem('token');

        const { result } = renderHook(() => useFetchOrder());

        // Data should not be fetched
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe('User ID or token is missing.');
        expect(result.current.loading).toBe(false);
    });

    test('handles API error response correctly', async () => {
        const errorMessage = 'Network Error';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        const { result, waitForNextUpdate } = renderHook(() => useFetchOrder());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
    });

    test('handles API error response with error message in response data', async () => {
        const errorMessage = 'Order not found';
        mockedAxios.get.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        });

        const { result, waitForNextUpdate } = renderHook(() => useFetchOrder());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
    });
});
