import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { IProduct } from '../types/Types';
import { API } from '../route/Route';

// Custom hook to handle fetching products
const useProductById = (id: string | undefined) => {
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch product using Id
    const fetchProduct = async (productId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API.PRODUCTS.PRODUCT_BY_ID.replace("{0}", productId));
            setProduct(response.data);
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            setError(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id]);

    return {
        product,
        loading,
        error,
    };
};

export default useProductById;
