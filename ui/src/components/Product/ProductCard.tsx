import { useEffect, useState } from "react";

import { IProduct } from "../../types/Types";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils";
import { HeartIcon } from "@heroicons/react/16/solid";
import useCheckout from "../../hooks/useCheckout";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { addItemToWishlistAPI, removeItemFromWishlistAPI } from "../../service/wishlistService";
import useViewWishlist from "../../hooks/useViewWishlist";

const ProductCard = ({ product }: { product: IProduct }) => {
    const { _id, name, price, description, image } = product
    const { removeFromCart } = useCart();
    const { checkout } = useCheckout();
    const navigate = useNavigate();
    const { wishlist, addToWishlist, removeFromWishlist, setWishlist } = useWishlist();
    const { wishlist: wishlisAPI } = useViewWishlist()

    const [isToken, setIsToken] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (typeof window !== 'undefined' && token) {
            setIsToken(true)
        }
    }, [navigate]);
    useEffect(() => {
        if (wishlisAPI && wishlisAPI.length) {
            const temp = wishlisAPI.map((item) => item._id)
            setWishlist(temp)
        }

    }, [wishlisAPI])

    const handleCheckout = async (e: any) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
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
                    navigate("/successPage")
                    removeFromCart(_id)
                }
            } catch (error) {
                alert('Checkout failed, please try again.');
            }
        } else {
            navigate("/login")
        }
    };
    return (
        <>
            <div className="max-w-full mx-auto py-4 pr-12 pl-2">
                <div className="mb-4 p-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="relative">
                        <img className="w-60 h-60 object-contain rounded-lg" src={image} alt={name} />
                        {isToken ? wishlist?.length && wishlist.includes(_id) ?
                            <button className="absolute -top-8 -right-1 text-red-500" onClick={async (e) => {
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
                            <button className="absolute -top-8 -right-1 text-gray-500" onClick={async (e) => {
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
                    <div className="flex-1 ml-6 mt-4 md:mt-0">
                        <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                        <p className="text-gray-600 mt-2">{description}</p>
                        <p className="text-xl font-bold text-gray-800 mt-4">{formatCurrency(price)}/-</p>

                    </div>
                    <div className="pr-8">
                        <button className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600" onClick={handleCheckout}>Buy Now</button>
                    </div>
                </div>
                <hr className="h-px bg-gray-900 mb-2" />
            </div>


        </>
    );
};

export default ProductCard;
