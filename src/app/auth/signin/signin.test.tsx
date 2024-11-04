// src/app/auth/signin/signin.test.tsx
import { render, screen } from '@testing-library/react';
import Login from './page';
import * as nextRouter from 'next/navigation'; 
import { CartProvider } from '@/context/CartContext';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login Component', () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn(); // Create a mock function for push
    (nextRouter.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  it('renders login form', () => {
    render(
      <CartProvider>
        <Login />
      </CartProvider>
    );
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

});
