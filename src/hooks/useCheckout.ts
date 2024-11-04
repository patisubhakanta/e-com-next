import { useCallback } from 'react';
import axios from 'axios';
import { IProduct } from '../types/Types';
import { API } from '../route/Route';

interface Product {
    productId: string;
    qty: number;
    price: number;
    productImage: string;
}

interface CheckoutResponse {
    message: string;
    products: Product[];
}

const useCheckout = () => {
    const checkout = useCallback(async (cart: { product: IProduct; quantity: number }[]): Promise<CheckoutResponse> => {
        const token = sessionStorage.getItem('token');

        const products = cart.map((checkoutProduct) => {
            const { product, quantity } = checkoutProduct;

            return {
                productId: product._id,
                qty: quantity,
                price: product.price,
            };
        });

        const data = {
            products,
        };

        try {
            const response = await axios.post<CheckoutResponse>(API.ORDER.PLACE_ORDER, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            console.error('Checkout failed:', error);
            throw error;
        }
    }, []);

    return { checkout };
};

export default useCheckout;
