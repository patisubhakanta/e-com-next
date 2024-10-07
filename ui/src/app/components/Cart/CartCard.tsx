import { formatCurrency } from "../../utils";


const CartItemCard = ({ image, price, qty, total }: { image: string, price: number, qty: number, total: number }) => {

    return (
        <div className="bg-white shadow-md rounded-lg w-full flex flex-col md:flex-row  justify-between items-center p-4 mb-4">
            {/* Image Section */}
            <div className="relative w-full h-24 flex justify-start items-start">
                <img
                    className="w-full h-24 object-contain"
                    src={image}
                    alt="Product"
                />
            </div>
            <div className="w-full flex flex-col justify-between items-start mt-3 md:mt-0">
                <span className="text-lg font-bold">Price: {formatCurrency(price)}</span>
                <span className="text-sm text-gray-500">Qty: {qty}</span>
            </div>

            <div className="w-full flex justify-end">
                <span className="text-xl font-semibold">Total: {formatCurrency(total)}</span>
            </div>
        </div>
    );
};

export default CartItemCard;
