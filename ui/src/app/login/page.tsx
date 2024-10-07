"use client"
import { useEffect, useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API } from '../route/Route';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { cart } = useCart();

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post(API.AUTH.SIGNIN, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.user.id);
            router.push(cart.length ? '/cart' : "/");
        } catch (error) {
            alert('Login failed!');
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            router.push('/');
        }
    }, [router]);
    return (
        <div className="flex items-center justify-center h-screen">
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
                <div className="flex items-center justify-end my-4"> <Link href={`/forgot-password`} className='text-blue-500'>Reset Password</Link></div>
                <div>Don't have account ? <Link href={`/signup`} className='text-blue-500'>SignUp</Link></div>
            </form>
        </div>
    );
};

export default Login;
