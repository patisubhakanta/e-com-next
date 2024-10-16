import { API } from "../route/Route";
import axios from 'axios';

export const removeItemFromWishlistAPI = async (_id:string) => {
    const token = localStorage.getItem('token');

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
    } catch (error: any) {
        // Handle errors
        throw new Error(error.response?.data?.message || "Failed to remove item from wishlist");
    }
};

export const addItemToWishlistAPI = async (_id: string) => {
    const token = localStorage.getItem('token');

    // Log the token for debugging
    console.log('Token:', token); 

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

        // Log the response to check if it's successful
        console.log('Response from API:', response.data); 
        return response.data;  
    } catch (error: any) {
        // Log the entire error for better debugging
        console.error('API call error:', error); 
        throw new Error(error.response?.data?.message || "Failed to add item to wishlist");
    }
};
