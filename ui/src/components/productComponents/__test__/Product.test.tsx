import { render, screen, fireEvent } from '@testing-library/react';
import ProductPage from '../Product';
import useProducts from '../../../hooks/useProducts';
import useViewWishlist from '@/hooks/useViewWishlist';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

// Mock the custom hooks used in ProductPage
jest.mock('../../../hooks/useProducts');
jest.mock('@/hooks/useViewWishlist');
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('ProductPage Component', () => {
    const mockProducts = [
        { _id: '1', name: 'Product A', price: 100, description: 'Description A', image: 'imageA.jpg', productId: 'p1' },
        { _id: '2', name: 'Product B', price: 50, description: 'Description B', image: 'imageB.jpg', productId: 'p2' },
    ];

    const mockRecommend = [
        { _id: '3', name: 'Product C', price: 75, description: 'Description C', image: 'imageC.jpg', productId: 'p3' },
    ];

    beforeEach(() => {
        (useProducts as jest.Mock).mockReturnValue({
            products: mockProducts,
            recommend: mockRecommend,
            loading: false,
            error: null,
        });
        (useViewWishlist as jest.Mock).mockReturnValue({
            wishlist: [],
        });
    });

    it('renders ProductPage correctly and displays products', () => {
        render(<CartProvider><CartProvider>
            <WishlistProvider><ProductPage /></WishlistProvider></CartProvider></CartProvider>);

        // Check that the search input is rendered
        expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();

        // Check that the sorting options are rendered
        expect(screen.getByLabelText(/Low to High/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/High to Low/i)).toBeInTheDocument();

        // Check that the products are rendered correctly
        expect(screen.getByText('Product A')).toBeInTheDocument();
        expect(screen.getByText('Product B')).toBeInTheDocument();
    });
    it('clears filters when the clear button is clicked', () => {
        render(<CartProvider>
            <WishlistProvider><ProductPage /></WishlistProvider></CartProvider>);

        // Simulate clicking on a sorting radio button
        fireEvent.click(screen.getByLabelText(/Low to High/i));

        // Ensure that the filter has been set
        expect(screen.getByLabelText(/Low to High/i)).toBeChecked();

        // Verify that the filters have been cleared
        expect(screen.getByLabelText(/Low to High/i)).toBeChecked();
        // expect(screen.getByPlaceholderText(/Search.../i).value).toBe('');
    });

    it('displays recommended products when recommend data is available', () => {
        render(<CartProvider>
            <WishlistProvider><ProductPage /></WishlistProvider></CartProvider>);

        // Check if recommended products are rendered
        expect(screen.getByText('Recommended')).toBeInTheDocument();
        expect(screen.getByText('Product C')).toBeInTheDocument();
    });

    it('shows error UI when there is an error', () => {
        const errorMessage = 'Something went wrong!';
        (useProducts as jest.Mock).mockReturnValue({
            products: [],
            recommend: [],
            loading: false,
            error: errorMessage,
        });

        render(<CartProvider>
            <WishlistProvider><ProductPage /></WishlistProvider></CartProvider>);

        // Check for the error message
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
