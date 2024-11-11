import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import useViewWishlist from '../useViewWishlist';
import { WishlistItem } from '@/types/Types';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useViewWishlist', () => {
    const token = 'mockToken';
    const mockWishlist: WishlistItem[] = [
        {
            _id: 'item1',
            name: 'Wishlist Item 1',
            price: 100,
            image: 'image1.jpg',
            inStock: true,
        },
        {
            _id: 'item2',
            name: 'Wishlist Item 2',
            price: 200,
            image: 'image2.jpg',
            inStock: false,
        },
    ];

    beforeEach(() => {
        sessionStorage.setItem('token', token);
    });

    afterEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    test('fetches wishlist successfully', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockWishlist });

        const { result, waitForNextUpdate } = renderHook(() => useViewWishlist());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Wishlist data should be set correctly
        expect(result.current.wishlist).toEqual(mockWishlist);
        expect(result.current.error).toBeNull();
        expect(result.current.loading).toBe(false);
    });

    test('sets error when token is missing', () => {
        // Clear token
        sessionStorage.removeItem('token');

        const { result } = renderHook(() => useViewWishlist());

        // Data should not be fetched
        expect(result.current.wishlist).toBeNull();
        expect(result.current.error).toBe('No token provided');
        expect(result.current.loading).toBe(false);
    });

    test('handles API error response correctly', async () => {
        const errorMessage = 'Failed to fetch wishlist';
        mockedAxios.get.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        });

        const { result, waitForNextUpdate } = renderHook(() => useViewWishlist());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.wishlist).toBeNull();
        expect(result.current.error).toBe(errorMessage);
        expect(result.current.loading).toBe(false);
    });

    test('handles general network error correctly', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

        const { result, waitForNextUpdate } = renderHook(() => useViewWishlist());

        // Initial loading state
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();

        // Error should be set correctly
        expect(result.current.wishlist).toBeNull();
        expect(result.current.error).toBe('Something went wrong');
        expect(result.current.loading).toBe(false);
    });
});
