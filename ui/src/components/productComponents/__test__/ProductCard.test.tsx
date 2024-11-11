import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

import { useRouter } from 'next/navigation';
import { IProduct, WishlistItem } from '@/types/Types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { addItemToWishlistAPI, removeItemFromWishlistAPI } from '@/service/wishlistService';
import useCheckout from '@/hooks/useCheckout';

// Mock dependencies
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
jest.mock('@/context/CartContext', () => ({ useCart: jest.fn() }));
jest.mock('@/context/WishlistContext', () => ({ useWishlist: jest.fn() }));
jest.mock('@/service/wishlistService');
jest.mock('@/hooks/useCheckout');

describe('ProductCard', () => {
    const mockProduct: IProduct = {
        _id: '1',
        name: 'Test Product',
        price: 100,
        image: 'test-image.jpg',
        inStock: true,
    };
    const mockWishlist: WishlistItem[] = [{ _id: '1', name: 'Test Product', price: 100,inStock:true }];
    const mockPush = jest.fn();
    const mockRemoveFromCart = jest.fn();
    const mockAddToWishlist = jest.fn();
    const mockRemoveFromWishlist = jest.fn();
    const mockCheckout = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCart as jest.Mock).mockReturnValue({ removeFromCart: mockRemoveFromCart });
        (useWishlist as jest.Mock).mockReturnValue({
            wishlist: ['1'],
            addToWishlist: mockAddToWishlist,
            removeFromWishlist: mockRemoveFromWishlist,
            setWishlist: jest.fn(),
        });
        (useCheckout as jest.Mock).mockReturnValue({ checkout: mockCheckout });
        sessionStorage.setItem('token', 'mockToken');
    });

    afterEach(() => {
        jest.clearAllMocks();
        sessionStorage.clear();
    });

    test('renders product information', () => {
        render(<ProductCard product={mockProduct} wishlisAPI={mockWishlist} />);

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('$100.00')).toBeInTheDocument();
        expect(screen.getByAltText('Test Product')).toHaveAttribute('src', 'test-image.jpg');
    });

    test('adds product to wishlist when not already in wishlist', async () => {
        (addItemToWishlistAPI as jest.Mock).mockResolvedValueOnce({});
        render(<ProductCard product={mockProduct} wishlisAPI={[]} />);

        const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
        fireEvent.click(wishlistButton);

        expect(addItemToWishlistAPI).toHaveBeenCalledWith('1');
        expect(mockAddToWishlist).toHaveBeenCalledWith('1');
    });

    test('removes product from wishlist when already in wishlist', async () => {
        (removeItemFromWishlistAPI as jest.Mock).mockResolvedValueOnce({});
        render(<ProductCard product={mockProduct} wishlisAPI={mockWishlist} />);

        const wishlistButton = screen.getByRole('button', { name: /remove from wishlist/i });
        fireEvent.click(wishlistButton);

        expect(removeItemFromWishlistAPI).toHaveBeenCalledWith('1');
        expect(mockRemoveFromWishlist).toHaveBeenCalledWith('1');
    });

    test('redirects to success page and removes from cart on successful checkout', async () => {
        mockCheckout.mockResolvedValueOnce(true);
        render(<ProductCard product={mockProduct} wishlisAPI={mockWishlist} />);

        const checkoutButton = screen.getByRole('button', { name: /buy now/i });
        fireEvent.click(checkoutButton);

        expect(mockCheckout).toHaveBeenCalledWith([{ product: mockProduct, quantity: 1 }]);
        expect(mockPush).toHaveBeenCalledWith('/successPage');
        expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
    });

    test('redirects to sign-in page if no token on checkout', () => {
        sessionStorage.removeItem('token');
        render(<ProductCard product={mockProduct} wishlisAPI={mockWishlist} />);

        const checkoutButton = screen.getByRole('button', { name: /buy now/i });
        fireEvent.click(checkoutButton);

        expect(mockPush).toHaveBeenCalledWith('/auth/signin');
        expect(mockRemoveFromCart).not.toHaveBeenCalled();
    });
});
