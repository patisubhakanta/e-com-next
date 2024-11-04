import { API } from '@/route/Route';
import axios, { AxiosError } from 'axios';

interface CartItem {
    productId: string;
    quantity: number;
}

export const addItemsToCart = async (items: CartItem[]) => {
    try {
        const token = sessionStorage.getItem('token');
        await axios.post(API.CART.ADD, { items }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Failed to add items to cart';
        throw new Error(errorMessage);
       
    }
};
export const removeItemFromCart = async (id: string) => {
    try {
        const token = sessionStorage.getItem('token');
        await axios.post(API.CART.REMOVE, { productId:id }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Failed to add items to cart';
        throw new Error(errorMessage);
    }
};