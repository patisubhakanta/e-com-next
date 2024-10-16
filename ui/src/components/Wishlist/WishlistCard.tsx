import { TrashIcon } from "@heroicons/react/16/solid";
import { useCart } from "../../context/CartContext";
import { IProduct } from "../../types/Types";
import { formatCurrency } from "../../utils";
import { removeItemFromWishlistAPI } from "../../service/wishlistService";
import { useWishlist } from "../../context/WishlistContext";

const WishlistItemCard = ({ product }: { product: IProduct }) => {
    const { addToCart} = useCart();
    const { removeFromWishlist } = useWishlist()

    const { _id, name, image, description, price } = product

    return (
        <div className="max-w-full mx-auto py-4">
            <div className="w-full flex justify-end md:hidden">
                        <button onClick={async () => {
                            await removeItemFromWishlistAPI(_id)
                            removeFromWishlist(_id)
                        }
                        }>
                            <TrashIcon className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
            <div className="mb-4 p-4 flex flex-col md:flex-row items-center justify-between">
                <div className="relative">
                    <img className="w-60 h-60 object-contain rounded-lg" src={image} alt={name} />
                </div>
                <div className="flex-1 ml-6">
                    <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                    <p className="text-gray-600 mt-2">{description}</p>
                    <p className="text-xl font-bold text-gray-800 mt-4">{formatCurrency(price)}/-</p>

                </div>
                <div className="pr-8 mb-0 md:mb-10 flex flex-col items-end">
                    <div className="hidden md:block">
                        <button onClick={async () => {
                            await removeItemFromWishlistAPI(_id)
                            removeFromWishlist(_id)
                        }
                        }>
                            <TrashIcon className="w-5 h-5 text-gray-300" />
                        </button>
                    </div>
                    <div>
                        <button onClick={async () => {
                            addToCart(product, 1)
                            await removeItemFromWishlistAPI(_id)
                            removeFromWishlist(_id)
                        }} className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600">Add to cart</button>
                    </div>
                </div>

            </div>
            <hr className="h-px bg-gray-900 mb-2" />
        </div>
    );
};

export default WishlistItemCard;
