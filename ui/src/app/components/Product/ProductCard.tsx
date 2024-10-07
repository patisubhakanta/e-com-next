"use client";

import  { useEffect, useState } from "react";
import { IProduct } from "../../types/Types";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils";


const ProductCard = ({ product }: { product: IProduct }) => {
    const [qty, setQty] = useState(0)
    const { _id, name, inStock, price, description, image } = product
    const { addToCart, removeFromCart, cart } = useCart();


    useEffect(() => {
        const addedProduct = cart.find(item => item.product._id === product._id)
        const tempQty = addedProduct ? addedProduct.quantity : 0
        setQty(tempQty)
    }, [cart])
    return (
        <>
            <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white border border-gray-200 p-4 h-[450px]">
                <div className="relative w-full h-48">
                    <img
                        className="w-full h-48 object-contain"
                        src={image}
                        alt={name}
                    />
                </div>
                <div className="px-6 py-4">
                    <p className="text-gray-700 text-sm">
                        {name}
                    </p>
                    <div className="font-bold text-xl mb-2">{formatCurrency(price)}/-</div>
                    <p className="text-gray-700 text-sm">
                        {description}
                    </p>
                </div>
                <div className="px-6 py-4 flex itmes-center justify-center">
                    {qty ? <div className="flex items-center space-x-2">
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
                                removeFromCart(_id);
                            }}
                            className="border border-gray-800 text-gray-800 text-xl w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-200"
                        >
                            -
                        </button>
                    </div> :
                        <button onClick={(e) => {
                            e.preventDefault()
                            addToCart(product, 1)
                        }} disabled={!inStock} className="bg-blue-500 text-white px-4 py-2 rounded ml-4 hover:bg-blue-600">
                            Add to Cart
                        </button>}
                </div>

            </div>

        </>
    );
};

export default ProductCard;
