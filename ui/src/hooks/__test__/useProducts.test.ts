import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useProducts from '../useProducts';
import { IProduct } from '@/types/Types';


// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useProducts', () => {
    const mockProducts: IProduct[] = [
        {
            _id: 'product1',
            name: 'Product 1',
            price: 100,
            inStock: true,
            description: 'Test product 1',
            image: 'image1.jpg',
            qty: 10,
        },
        {
            _id: 'product2',
            name: 'Product 2',
            price: 150,
            inStock: true,
            description: 'Test product 2',
            image: 'image2.jpg',
            qty: 5,
        },
    ];

    const mockRecommendedProducts: IProduct[] = [
        {
            _id: 'product3',
            name: 'Product 3',
            price: 120,
            inStock: true,
            description: 'Recommended product 1',
            image: 'image3.jpg',
            qty: 3,
        },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('fetches products and recommended products successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { products: mockProducts, recommend: mockRecommendedProducts },
        });

        const { result, waitForNextUpdate } = renderHook(() => useProducts());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Products and recommend should be set correctly
        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.recommend).toEqual(mockRecommendedProducts);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    test('sets error on API failure', async () => {
        const errorMessage = 'Error fetching products';
        mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

        const { result, waitForNextUpdate } = renderHook(() => useProducts());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.products).toEqual([]);
        expect(result.current.recommend).toEqual([]);
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
    });

    test('fetches products with sort order and search query', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { products: mockProducts, recommend: mockRecommendedProducts },
        });

        const { result, waitForNextUpdate } = renderHook(() => useProducts('asc', 'Product'));

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Products and recommend should be set correctly
        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.recommend).toEqual(mockRecommendedProducts);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);

        // Verify axios called with correct params
        expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), {
            params: { sort: 'asc', search: 'Product' },
        });
    });
});
