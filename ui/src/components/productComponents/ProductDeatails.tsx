"use client";
import { useEffect, useState } from 'react';

import useCheckout from '../../hooks/useCheckout';
import useProductById from '../../hooks/useProductById';
import { formatCurrency } from '../../utils';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'next/navigation';
import { addItemToWishlistAPI, removeItemFromWishlistAPI } from '@/service/wishlistService';
import { HeartIcon } from '@heroicons/react/16/solid';
import { useWishlist } from '@/context/WishlistContext';
import { AxiosError } from 'axios';
import ErrorUI from '../errorComponent';


const ProductDetails = ({ id }: { id: string | undefined }) => {
    const [qty, setQty] = useState(0)
    const [isToken, setIsToken] = useState(false)
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { addToCart, removeFromCart, cart } = useCart();
    const { product, loading, error } = useProductById(id)
    const { checkout } = useCheckout();
    const router = useRouter();


    useEffect(() => {
         const token = sessionStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            setIsToken(true)
        }
    }, [router]);
    useEffect(() => {
        if (product) {
            const addedProduct = cart.find(item => item.product._id === product._id)
            const tempQty = addedProduct ? addedProduct.quantity : 0
            setQty(tempQty)
        }
    }, [cart, product])
    

    if (loading) return <p>Loading...</p>;

    if (error) return <ErrorUI message={error} />;

    const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (product) {
            e.preventDefault();
            const token = sessionStorage.getItem('token');
            const payload = {
                product: {
                    ...product
                },
                quantity: 1
            }
            if (token) {
                try {
                    const response = await checkout([payload]);
                    if (response) {
                        router.push("/successPage")
                        removeFromCart(product?._id || "",true)
                    }
                } catch (err) {
                    const error = err as AxiosError<{ message: string }>;
                    if (err) {
                        alert(error.response?.data?.message || 'Checkout failed, please try again.');
                    }
                }
            } else {
                router.push("/login")
            }
        }
    };

    return (
        product && <div id="productdetails" className='w-full flex items-center mt-[100px] md:mt-[100px]'>
            <div className="container mx-auto p-6 border">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col justify-center items-center">
                        <div className="relative flex justify-center md:justify-start items-start max-h-[70vh] h-full w-full">
                            <img
                                className="w-full h-full object-contain"
                                src={product.image}
                                alt="Product"
                            />
                            {isToken ? wishlist?.length && wishlist.includes(product._id) ?
                        <button className="absolute top-1 right-10 text-red-500" onClick={async (e) => {
                            e.preventDefault()

                            try {
                                await removeItemFromWishlistAPI(product._id); // Call the async function
                                removeFromWishlist(product._id)
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }}>
                            <HeartIcon className="w-6 h-6" />
                        </button> :
                        <button className="absolute top-1 right-10 text-gray-500" onClick={async (e) => {
                            e.preventDefault()
                            try {
                                await addItemToWishlistAPI(product._id)
                                addToWishlist(product._id)
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>

                        </button> : null}
                        </div>
                       
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className='mt-2 md:mt-20 '>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-700 text-base mb-4">{product.description}</p>
                            <div className="font-bold text-xl mb-2">{formatCurrency(product.price)}/-</div>
                        </div>
                        <div  className=" py-4 flex flex-col md:flex-row itmes-center justify-between w-contain">
                        <div className="flex  itmes-center w-full">
                            <div>
                                <button className="w-contain bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600 mr-4" onClick={handleCheckout}>Buy Now</button>
                            </div>
                            <div>
                                {qty ?
                                    <div className="w-full mt-5">
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromCart(product._id);
                                                }}
                                                className="border border-gray-800 text-gray-800 text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-200"
                                            >
                                                <span className="-mt-1 ">-</span>
                                            </button>
                                            <span className="text-gray-700 font-semibold">{qty}</span>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addToCart(product, 1);
                                                }}
                                                className="border border-gray-800 text-gray-800 text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-200"
                                            >
                                                <span className="-mt-1 ">+</span>
                                            </button>
                                        </div>
                                    </div>
                                    :
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        addToCart(product, 1)
                                    }} disabled={!product.inStock}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 w-contain">
                                        Add to Cart
                                    </button>}
                            </div>
                        </div>
                        <div className='w-full flex justify-end'>
                        <div className=" font-bold text-xl mb-2 mt-10 md:mt-4">Total : {formatCurrency(product.price * qty)}/-</div></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductDetails;
