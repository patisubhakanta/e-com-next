"use client";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import useCheckout from "../../hooks/useCheckout";
import { formatCurrency } from "../../utils";
import CartItemCard from "./CartCard";
import { IProduct } from "@/types/Types";
import { AxiosError } from "axios";


const CartItems = () => {
    const { cart, clearCart } = useCart();
    const { checkout } = useCheckout();
    const router = useRouter();

    const grandTotal = cart.reduce((total, checkoutProduct) => {
        const { product, quantity } = checkoutProduct;
        return total + product.price * quantity;
    }, 0);

    const handleCheckout = async () => {
        const token = sessionStorage.getItem('token');
        if (token) {
            try {
                const response = await checkout(cart);
                if (response) {
                    router.push("/successPage")
                    clearCart()
                }
            } catch (err) {
                const error = err as AxiosError<{ message: string }>;
                if (err) {
                    alert(error.response?.data?.message || 'Login failed!');
                }
            }
        } else {
            router.push("/login")
        }
    };
    return (
        <>
            {cart.length ?
                <div className="mt-[100px] min-h-[70vh] pb-10">
                    {cart.map((checkoutProduct: {product:IProduct,quantity:number}) => {
                        const { product,
                            quantity
                        } = checkoutProduct

                        return (
                            <div key={product._id} className="px-4">
                                <CartItemCard product={product} qty={Number(quantity)} total={product.price * Number(quantity)} />
                            </div>
                        )
                    })}
                    <div className="w-full flex justify-end items-center mt-10 ">
                        <p className="font-bold text-xl">Total : {formatCurrency(grandTotal)}/-</p>
                   
                        <button
                            onClick={handleCheckout}
                            className="px-8 w-contain text-white py-2 rounded hover:bg-blue-600 bg-blue-500 ml-10"
                        >
                            Place Order
                        </button>
                    </div>
                </div> : <h4 className="mt-[200px] h-[70vh]"> No product added</h4>}
        </>
    );
};

export default CartItems;