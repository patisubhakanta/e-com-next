import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SignupPage from './page';
import { useRouter } from 'next/navigation';
import { API } from '@/route/Route';

jest.mock('axios'); // Mock axios

// Mocking Next.js router
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockRouter = {
    push: jest.fn(),
};
beforeAll(() => {
    global.alert = jest.fn(); // Mock window.alert
});

describe('SignupPage Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter); // Mock useRouter to return our mock
    });

    it('renders signup form', () => {
        render(<SignupPage />);
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Enter Password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it("shows an error message if passwords don't match", async () => {
        render(<SignupPage />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Enter Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password' } }); // Different confirm password

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        expect(await screen.findByText("Passwords don't match!")).toBeInTheDocument();
    });

    it('submits the form with valid data (successful signup)', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: { message: 'User created successfully' },
        });

        render(<SignupPage />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Enter Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith(API.AUTH.SIGNUP, { 
                username: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
        });
    });

    it('handles signup failure', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Signup failed!'));

        render(<SignupPage />);

        fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Enter Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } }); // Matching confirm password

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Signup failed!'); // Check if alert is called
        });
    });

    it('redirects to home if already logged in', () => {
        sessionStorage.setItem('token', 'mock-token');
        render(<SignupPage />);
        
        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
});
