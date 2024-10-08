import { useCart } from "../../context/CartContext";
import { IProduct } from "../../types/Types";
import { formatCurrency } from "../../utils";


const WishlistItemCard = ({ product }: { product: IProduct }) => {
    const { addToCart, removeFromCart } = useCart();
    const { _id, name, image, description, price } = product
    return (
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
            <div className="px-6 py-4 flex items-center justify-center space-x-4">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                >
                    Add to Cart
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        removeFromCart(_id);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                >
                    Remove from Cart
                </button>
            </div>
        </div>

    );
};

export default WishlistItemCard;
