"use client"
import { useCart } from '@/app/context/CartContext';
import useProductById from '@/app/hooks/useProductById';
import { formatCurrency } from '@/app/utils';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';



const ProductDetails = ({ id }: { id: string | undefined }) => {
    const [qty, setQty] = useState(0)
    const { addToCart, removeFromCart, cart } = useCart();
    const { product, loading, error } = useProductById(id)
    useEffect(() => {
        if (product) {
            const addedProduct = cart.find(item => item.product._id === product._id)
            const tempQty = addedProduct ? addedProduct.quantity : 0
            setQty(tempQty)
        }
    }, [cart, product])

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    return (
        product && <div className='h-[70vh] w-full flex items-cneter mt-[200px] bg-white'>
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-center bg-white ">
                    <div className="relative w-full h-80 flex justify-start items-start">
                <img
                    className="w-full h-80 object-contain"
                    src={product.image}
                    alt="Product"
                />
            </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-700 text-base mb-4">{product.description}</p>
                            <div className="font-bold text-xl mb-2">{formatCurrency(product.price)}/-</div>
                        </div>
                        <div className="px-6 py-4 flex itmes-center w-full">
                            {qty ?
                                <div className="w-full flex itmes-center justify-between">
                                    <div className="font-bold text-xl mb-2">Total : {formatCurrency(product.price * qty)}/-</div>
                                    <div className="flex items-center space-x-6">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart(product, 1);
                                            }}
                                            className="border border-gray-800 text-gray-800 text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-200"
                                        >
                                            +
                                        </button>
                                        <span className="text-gray-700 font-semibold">{qty}</span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromCart(product._id);
                                            }}
                                            className="border border-gray-800 text-gray-800 text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-200"
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                                :
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    addToCart(product, 1)
                                }} disabled={!product.inStock} className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600 w-contain">
                                    Add to Cart
                                </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
