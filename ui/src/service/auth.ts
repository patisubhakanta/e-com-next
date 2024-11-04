import { API } from '@/route/Route';
import axios, { AxiosError } from 'axios';

export const resetPassword = async (email: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD, {
            email,
            newPassword,
        });
        return response.data; // return response data if needed
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Failed to reset password.';
        throw new Error(errorMessage);
    }
};
