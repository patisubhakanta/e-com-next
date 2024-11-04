"use client";
import { useCart } from "../../context/CartContext";
import { IProduct } from "../../types/Types";
import { formatCurrency } from "../../utils";

const CartItemCard = ({ product, qty, total }: { product: IProduct, qty: number, total: number }) => {

    const { addToCart, removeFromCart } = useCart();
    const { _id, name, price, description, image } = product
    return (
        <>
            <div className="max-w-full mx-auto py-4 pr-0 md:pr-12 pl-2">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="relative">
                        <img className="w-60 h-60 object-contain rounded-lg" src={image} alt={name} />
                    </div>
                    <div className="ml-6">
                        <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                        <p className="text-gray-600 mt-2">{description}</p>
                        <p className="text-xl font-bold text-gray-800 mt-4">{formatCurrency(price)}/-</p>

                    </div>
                    <div className="w-full flex items-end justify-center md:justify-end mt-4 ml-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    removeFromCart(_id);
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
                </div>
                <div className="w-full flex justify-center md:justify-end mt-4 md:mt-0 ml-2 md:ml:0">
                    <span className="text-xl font-semibold">Total: {formatCurrency(total)}</span>
                </div>
                <hr className="h-px bg-gray-900 my-2" />
            </div>


        </>
    );
};

export default CartItemCard;
