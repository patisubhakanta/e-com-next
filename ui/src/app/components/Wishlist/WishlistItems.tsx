"use client";

import { useRouter } from "next/router";
import { useCart } from "../../context/CartContext";
import WishlistItemCard from "./WishlistCard";

const WishListItems = () => {
    const { cart, clearCart } = useCart();

    const router = useRouter();

    return (
        <>
            {cart.length ?
                <div className="mt-[200px] h-[70vh]">
                    {cart.map((checkoutProduct: any) => {
                        const { product,
                            quantity
                        } = checkoutProduct

                        return (
                            <div key={product._id} className="px-4">
                                <WishlistItemCard product={product} />
                            </div>
                        )
                    })}

                </div> : <div className="mt-[200px] h-[70vh]"> No product added</div>}
        </>
    );
};

export default WishListItems;