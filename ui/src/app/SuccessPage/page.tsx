"use client"
import { useRouter } from 'next/navigation';
import React from 'react';
import Logo from "../../../assets/icon.png"
import Image from 'next/image';

const SuccessPage: React.FC = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push('/profile');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="p-10 rounded-lg shadow-lg max-w-lg text-center">
                <div className='flex justify-center items-center mb-8'>
                    <Image src={Logo} alt="Logo" width={96} height={192} />
                </div>
                <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-700 mb-6">
                    Your product has been successfully placed. You will receive an email confirmation shortly.
                </p>
                <button
                    onClick={handleRedirect}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-200"
                >
                    Go to Orders
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;
