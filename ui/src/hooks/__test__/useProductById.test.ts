import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useProductById from '../useProductById';
import { IProduct } from '@/types/Types';


// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useProductById', () => {
    const mockProduct: IProduct = {
        _id: 'product1',
        name: 'Product 1',
        price: 100,
        inStock: true,
        description: 'Test product description',
        image: 'image1.jpg',
        qty: 10,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches product by ID successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockProduct });

        const { result, waitForNextUpdate } = renderHook(() => useProductById('product1'));

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Product data should be set correctly
        expect(result.current.product).toEqual(mockProduct);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    test('does not call API when ID is undefined', async () => {
        const { result } = renderHook(() => useProductById(undefined));

        // No API call should be made, and product should remain null
        expect(result.current.product).toBeNull();
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);

        // Ensure axios.get was never called
        expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    test('handles API error response correctly', async () => {
        const errorMessage = 'Product not found';
        mockedAxios.get.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        });

        const { result, waitForNextUpdate } = renderHook(() => useProductById('invalidId'));

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.product).toBeNull();
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
    });

    test('handles general network error correctly', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        const { result, waitForNextUpdate } = renderHook(() => useProductById('product1'));

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly with default message
        expect(result.current.product).toBeNull();
        expect(result.current.error).toBe('Network Error');
        expect(result.current.loading).toBe(false);
    });
});
