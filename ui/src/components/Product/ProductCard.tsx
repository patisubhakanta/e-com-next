"use client";
import { useEffect, useState } from "react";

import { IProduct, WishlistItem } from "../../types/Types";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils";
import { HeartIcon } from "@heroicons/react/16/solid";
import useCheckout from "../../hooks/useCheckout";
import { useWishlist } from "../../context/WishlistContext";
import { addItemToWishlistAPI, removeItemFromWishlistAPI } from "../../service/wishlistService";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const ProductCard = ({ product,wishlisAPI }: { product: IProduct,wishlisAPI:WishlistItem[] | null }) => {
    const { _id, name, price, image } = product
    const { removeFromCart } = useCart();
    const { checkout } = useCheckout();
    const router = useRouter();
    const { wishlist, addToWishlist, removeFromWishlist, setWishlist } = useWishlist();
   

    const [isToken, setIsToken] = useState(false)

    useEffect(() => {
         const token = sessionStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            setIsToken(true)
        }
    }, [router]);
    useEffect(() => {
        if (wishlisAPI && wishlisAPI.length) {
            const temp = wishlisAPI.map((item) => item._id)
            setWishlist(temp)
        }

    }, [wishlisAPI])

    const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
                    removeFromCart(_id)
                }
            } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            if (err) {
                alert(error.response?.data?.message || 'Login failed!');
            }
            }
        } else {
            router.push("/auth/signin")
        }
    };

    return (
        <>
            <div className="group relative border rounded-lg">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md  lg:aspect-none group-hover:opacity-75 py-6 relative">
                   <div className="w-full flex items-center justify-center">
                   <img
                        src={image} alt={name}
                        className="w-60 h-60 object-contain rounded-lg"
                    />
                   </div>
                    {isToken ? wishlist?.length && wishlist.includes(_id) ?
                        <button className="absolute top-1 right-1 text-red-500" onClick={async (e) => {
                            e.preventDefault()

                            try {
                                await removeItemFromWishlistAPI(_id); // Call the async function
                                removeFromWishlist(_id)
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }}>
                            <HeartIcon className="w-6 h-6" />
                        </button> :
                        <button className="absolute top-1 right-1 text-gray-500" onClick={async (e) => {
                            e.preventDefault()
                            try {
                                await addItemToWishlistAPI(_id)
                                addToWishlist(_id)
                            } catch (error) {
                                console.error('Error:', error);
                            }
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>

                        </button> : null}
                </div>

                <div className="bg-gray-200 px-4 py-4 flex justify-between">
                    <div>
                        <h3 className="text-sm text-gray-700">

                           
                            {name}

                        </h3>

                        <button className="border border-gray-900 px-2 py-1 rounded-lg mt-2 text-sm text-gray-500 hover:bg-gray-300 font-medium" onClick={handleCheckout}>Buy Now</button>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(price)}</p>
                </div>
            </div>


        </>
    );
};

export default ProductCard;
