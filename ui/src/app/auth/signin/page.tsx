"use client";
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { API } from '../../../route/Route';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { addItemsToCart } from '@/service/cartService';
import { IProduct } from '@/types/Types';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { cart, addToCart } = useCart();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(API.AUTH.SIGNIN, { email, password });
            sessionStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id);

            const serverCartItems = response.data.cart;
            serverCartItems.forEach((item: IProduct) => {
                const existsInLocal = cart.find(localItem => localItem.product._id === item.productId);

                if (!existsInLocal) {
                    addToCart({
                        ...item,
                        _id: item.productId || ""
                    }, Number(item.qty), true);
                }
            });

            for (const localItem of cart) {
                const existsInServer = serverCartItems.find((serverItem: IProduct) => serverItem.productId === localItem.product._id);
                if (!existsInServer) {
                    if (localItem.product._id) {
                        await addItemsToCart([{
                            productId: localItem.product._id,
                            quantity: localItem.quantity
                        }]);
                    }
                }
            }

            router.push(cart.length ? '/cart' : "/");
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            alert(error.response?.data?.message || 'Login failed!');
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div id="login" className="flex items-center justify-center h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Login
                </button>
                <div className="flex items-center justify-end my-4">
                    <Link href={`/auth/reset-password`} passHref className='text-blue-500'>Reset Password</Link>
                </div>
                <div>
                    <span>Don&apos;t have an account?</span> 
                    <Link passHref href={`/auth/signup`} className='text-blue-500'>SignUp</Link>
                </div>
            </form>
        </div>
    );
};

export default Login;
