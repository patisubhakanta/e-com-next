import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/service/auth';
import ResetPassword from './page';
import * as authService from '@/service/auth';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

const mockRouter = {
    push: jest.fn(),
};
 jest.mock('@/service/auth');
describe('ResetPassword Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        sessionStorage.clear(); // Clear session storage before each test
    });

    it('renders reset password form', () => {
        render(<ResetPassword />);

        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Reset Password/i })).toBeInTheDocument();
    });

    it("shows an error if passwords don't match", async () => {
        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
    });

    it('calls resetPassword and redirects on successful reset', async () => {
        (authService.resetPassword as jest.Mock).mockResolvedValueOnce({ message: 'Password reset successful' });

        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        await waitFor(() => {
            expect(resetPassword).toHaveBeenCalledWith('test@example.com', 'password123');
            expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin');
        });
    });

    it('displays an error message if reset fails', async () => {
        (authService.resetPassword as jest.Mock).mockRejectedValueOnce(new Error('Failed to reset password'));

        render(<ResetPassword />);

        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/New Password/i), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

        await waitFor(() => {
            expect(screen.getByText('Failed to reset password')).toBeInTheDocument();
        });
    });

    it('redirects to home if token is present in session storage', () => {
        sessionStorage.setItem('token', 'mock-token');
        render(<ResetPassword />);

        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });
});
