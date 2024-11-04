import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { API } from '../route/Route';
import { UseWishlistResult, WishlistItem } from '@/types/Types';



const useViewWishlist = (): UseWishlistResult => {
    const [wishlist, setWishlist] = useState<WishlistItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                setError("No token provided");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get<WishlistItem[]>(API.WISHLIST.VIEW_WISHLIST, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setWishlist(response.data);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                setError(error.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return { wishlist, loading, error };
};

export default useViewWishlist;
