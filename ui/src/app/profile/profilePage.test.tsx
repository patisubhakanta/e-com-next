import { render } from '@testing-library/react';
import ProfilePage from './page';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatTimestamp, getOrderStatus } from '../../utils';
import '@testing-library/jest-dom';

jest.mock('../../hooks/useFetchOrder');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../utils', () => ({
  formatCurrency: jest.fn(),
  formatTimestamp: jest.fn(),
  getOrderStatus: jest.fn(),
}));

const mockRouter = { push: jest.fn() };

jest.mock('../../hooks/useFetchOrder', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    data: {
      username: 'Test User',
      orders: [{
        items: [
          {
            orders: [
              { _id: '1', name: 'Product A', qty: 1, price: 100, description: 'Description A', image: 'imgA.jpg', productId: 'p1' },
              { _id: '2', name: 'Product B', qty: 2, price: 50, description: 'Description B', image: 'imgB.jpg', productId: 'p2' },
            ],
            timestamp: '2023-01-01T00:00:00Z',
          },
        ],
      }],
    },
  })),
}));



describe('ProfilePage Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
   
    (formatCurrency as jest.Mock).mockImplementation((price) => `$${price.toFixed(2)}`);
    (formatTimestamp as jest.Mock).mockReturnValue('Jan 1, 2023');
    (getOrderStatus as jest.Mock).mockReturnValue('Shipped');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the user profile with name', async () => {
    render(<ProfilePage />);

  });

  // it('navigates to the wishlist page on button click', async() => {
  //   render(<ProfilePage />);
    
  //   await waitFor(() => {
  //     expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  //   });
  
  //   // Now check for the wishlist button
  //   const wishlistButton = await screen.findByRole('button', { name: /wishlist/i });
  
  //   // Perform the click action
  //   fireEvent.click(wishlistButton);
  
  //   // Verify router push was called with the correct path
  //   expect(mockRouter.push).toHaveBeenCalledWith('/wishlist');
  // });

  // it('renders order history with formatted date and status', () => {
  //   render(<ProfilePage />);

  //   expect(screen.getByText('Order Status')).toBeInTheDocument();
  //   expect(screen.getByText('Shipped')).toBeInTheDocument();
  //   expect(screen.getByText('Date placed')).toBeInTheDocument();
  //   expect(screen.getByText('Jan 1, 2023')).toBeInTheDocument();
  // });

  // it('displays total price for each order', () => {
  //   render(<ProfilePage />);

  //   expect(formatCurrency).toHaveBeenCalledWith(200); // Total price for the example order
  //   expect(screen.getByText('$200.00')).toBeInTheDocument();
  // });

  // it('renders product details within order items', () => {
  //   render(<ProfilePage />);

  //   const productA = screen.getByText('Product A');
  //   const productB = screen.getByText('Product B');
  //   expect(productA).toBeInTheDocument();
  //   expect(productB).toBeInTheDocument();

  //   expect(screen.getByText('Description A')).toBeInTheDocument();
  //   expect(screen.getByText('Description B')).toBeInTheDocument();
  //   expect(screen.getAllByRole('img')).toHaveLength(2); // Images for products A and B
  // });

  // it('redirects to product details page when "View product" is clicked', () => {
  //   render(<ProfilePage />);

  //   const viewProductLink = screen.getByRole('link', { name: /view product/i });
  //   fireEvent.click(viewProductLink);

  //   expect(mockRouter.push).toHaveBeenCalledWith('/product/p1');
  // });
});
