import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useCheckout from '../../hooks/useCheckout';
import useProductById from '../../hooks/useProductById';
import { formatCurrency } from '../../utils';
import { useCart } from '../../context/CartContext';

import ErrorUI from '../Error';


const ProductDetails = ({ id }: { id: string | undefined }) => {
    const [qty, setQty] = useState(0)
    const { addToCart, removeFromCart, cart } = useCart();
    const { product, loading, error } = useProductById(id)
    const { checkout } = useCheckout();
    const navigate = useNavigate();
    useEffect(() => {
        if (product) {
            const addedProduct = cart.find(item => item.product._id === product._id)
            const tempQty = addedProduct ? addedProduct.quantity : 0
            setQty(tempQty)
        }
    }, [cart, product])
    

    if (loading) return <p>Loading...</p>;

    if (error) return <ErrorUI message={error} />;

    const handleCheckout = async (e: any) => {
        if (product) {
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
                        removeFromCart(product?._id || "")
                    }
                } catch (error) {
                    alert('Checkout failed, please try again.');
                }
            } else {
                navigate("/login")
            }
        }
    };

    return (
        product && <div className='h-[70vh] w-full flex items-cneter mt-[100px] md:mt-[200px] bg-white'>
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="flex flex-col justify-start items-start bg-white ">
                        <div className="relative h-[300px] md:h-[500px] flex justify-center md:justify-start items-start">
                            <img
                                className="w-full h-full object-contain"
                                src={product.image}
                                alt="Product"
                            />
                        </div>
                        <div className="px-6 py-4 flex itmes-center justify-between w-full lg:w-1/2">
                            <div>
                                <button className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600 ml-4" onClick={handleCheckout}>Buy Now</button>
                            </div>
                            <div>
                                {qty ?
                                    <div className="w-full mt-5">
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    removeFromCart(product._id);
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
                                    :
                                    <button onClick={(e) => {
                                        e.preventDefault()
                                        addToCart(product, 1)
                                    }} disabled={!product.inStock}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600 w-contain">
                                        Add to Cart
                                    </button>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                            <p className="text-gray-700 text-base mb-4">{product.description}</p>
                            <div className="font-bold text-xl mb-2">{formatCurrency(product.price)}/-</div>
                        </div>
                        <div className="font-bold text-xl mb-2 mt-10 md:mt-4">Total : {formatCurrency(product.price * qty)}/-</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductDetails;
