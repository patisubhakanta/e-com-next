import { API } from "../route/Route";
import axios, { AxiosError } from 'axios';

export const removeItemFromWishlistAPI = async (_id:string) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    try {
     await axios.post(
            API.WISHLIST.REMOVEWISHLIST,
            { _id },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "Failed to remove item from wishlist";
        throw new Error(errorMessage);
    }
};

export const addItemToWishlistAPI = async (_id: string) => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        throw new Error('No token found');
    }

    try {
        const response = await axios.post(
            API.WISHLIST.ADD_WISHLIST,  
            { _id },  
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;  
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "Failed to remove item from wishlist";
        throw new Error(errorMessage);
    }
};
