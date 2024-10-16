
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useCheckout from "../../hooks/useCheckout";
import { formatCurrency } from "../../utils";
import CartItemCard from "./CartCard";



const CartItems = () => {
    const { cart, clearCart } = useCart();
    const { checkout } = useCheckout();
    const navigate = useNavigate();

    const grandTotal = cart.reduce((total, checkoutProduct) => {
        const { product, quantity } = checkoutProduct;
        return total + product.price * quantity;
    }, 0);

    const handleCheckout = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await checkout(cart);
                if (response) {
                    navigate("/successPage")
                    clearCart()
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
            {cart.length ?
                <div className="mt-[200px] min-h-[70vh] pb-10">
                    {cart.map((checkoutProduct: any) => {
                        const { product,
                            quantity
                        } = checkoutProduct

                        return (
                            <div key={product._id} className="px-4">
                                <CartItemCard product={product} qty={Number(quantity)} total={product.price * Number(quantity)} />
                            </div>
                        )
                    })}
                    <div className="w-full flex justify-end mt-10">
                        <div className="font-bold text-xl mb-2">Total : {formatCurrency(grandTotal)}/-</div>
                    </div>
                    <div className="w-full flex justify-center my-10">
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