"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/service/auth';

const ResetPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            await resetPassword(email, newPassword);
            router.push('/auth/signin');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message || 'Failed to reset password. Please try again.');
            } else {
                setError('Failed to reset password. Please try again.');
            }
        }
    };
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div id="resetPassword" className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4">Reset Password</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
