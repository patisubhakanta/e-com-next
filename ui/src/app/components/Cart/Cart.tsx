import { useCart } from "@/app/context/CartContext";
import React from "react";
import CartItemCard from "./CartCard";
import { formatCurrency } from "@/app/utils";
import useCheckout from "@/app/hooks/useCheckout";
import { useRouter } from "next/navigation";


const CartItems = () => {
    const { cart, clearCart } = useCart();
    const { checkout } = useCheckout();
    const router = useRouter();
    const token = localStorage.getItem('token');

    const grandTotal = cart.reduce((total, checkoutProduct) => {
        const { product, quantity } = checkoutProduct;
        return total + product.price * quantity;
    }, 0);

    const handleCheckout = async () => {
        if (token) {
            try {
                const response = await checkout(cart);
                if (response) {
                    router.push("/SuccessPage")
                    clearCart()
                }
            } catch (error) {
                alert('Checkout failed, please try again.');
            }
        } else {
            router.push("/login")
        }
    };
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
                                <CartItemCard image={product.image || ""} price={product.price} qty={Number(quantity)} total={product.price * Number(quantity)} />
                            </div>
                        )
                    })}
                    <div className="w-full flex justify-end mt-10">
                        <div className="font-bold text-xl mb-2">Total : {formatCurrency(grandTotal)}/-</div>
                    </div>
                    <div className="w-full flex justify-center mt-10">
                        <button
                            onClick={handleCheckout}
                            className="px-8 w-contain text-white p-2 rounded hover:bg-blue-600 bg-blue-500"
                        >
                            Place Order
                        </button>
                    </div>
                </div> : <div className="mt-[200px] h-[70vh]"> No product added</div>}
        </>
    );
};

export default CartItems;