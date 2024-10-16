import { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../route/Route';

const useFetchOrder = () => {
    const [data, setData] = useState<any>(null); // Replace `any` with your expected data type
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const userId = localStorage.getItem('userId'); // Make sure to set this in localStorage
            const token = localStorage.getItem('token');

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
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, []);

    return { data, error, loading };
};

export default useFetchOrder;
