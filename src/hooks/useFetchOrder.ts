import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { API } from '../route/Route';
import { OrdersResponse } from '@/types/Types';

const useFetchOrder = () => {
    const [data, setData] = useState<OrdersResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const userId = localStorage.getItem('userId');
            const token = sessionStorage.getItem('token');
            if (!userId || !token) {
                setError('User ID or token is missing.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(API.ORDER.ORDERD_ITEMS.replace("{0}", userId), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setData(response.data);
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                setError(error.response?.data?.message || error.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    return { data, error, loading };
};

export default useFetchOrder;
