import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../route/Route';

interface WishlistItem {
    _id: string;
    name: string;
    description?: string;
    price: number;
    inStock: boolean;
    image?: string;
}

interface UseWishlistResult {
    wishlist: WishlistItem[] | null;
    loading: boolean;
    error: string | null;
}

const useViewWishlist = (): UseWishlistResult => {
    const [wishlist, setWishlist] = useState<WishlistItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            const token = localStorage.getItem('token');
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
            } catch (err: any) {
                console.log(error)
                setError(err.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return { wishlist, loading, error };
};

export default useViewWishlist;
