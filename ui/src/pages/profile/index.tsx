import { useNavigate } from "react-router-dom";
import useFetchOrder from "../../hooks/useFetchOrder";
import { formatCurrency, formatTimestamp, getOrderStatus } from "../../utils";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { data } = useFetchOrder()

    return (
        <div className="mt-[50px] md:mt-[70px] h-[70vh]">
            <div className="max-w-4xl mx-auto p-4">
                <div className="w-full justify-center flex items-center">
                    <div className="flex items-center mb-8">
                        <img
                            src="https://via.placeholder.com/100"
                            alt="Profile"
                            className="w-24 h-24 rounded-full border border-gray-300"
                        />
                        <div className="ml-4">
                            <h1 className="text-2xl font-semibold">{data?.username || ""}</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center mb-8">
                    <button onClick={() => {
                        navigate("/wishlist")
                    }} className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600">Wishlist</button>
                </div>

                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                {data && data?.orders[0] && data?.orders[0]?.items && data.orders[0].items.map((order: any, index: number) => {
                    return (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <div className="w-full justify-between flex flex-col md:flex-row items-end md:items-center">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-green-600" id="shipped-dot"></div>
                                    <span className="text-gray-700">{getOrderStatus(order.timestamp)}</span>
                                </div>
                                <p className="text-gray-800">
                                    {formatTimestamp(order.timestamp)}
                                </p>
                            </div>
                            <hr className="my-4 h-0.5 bg-gray-900" />
                            {order?.orders && order.orders.map((item: any) => (
                                <div className="max-w-full mx-auto py-4">

                                    <div className="mb-4 p-4 flex flex-col md:flex-row items-center justify-between">
                                        <div className="relative">
                                            <img className="w-60 h-60 object-contain rounded-lg" src={item.image} alt={item.name} />
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <h2 className="text-lg font-bold text-gray-800">{item.name}</h2>
                                            <p className="text-gray-600 mt-2">{item.description}</p>
                                            <p className="text-xl font-bold text-gray-800 mt-4">{formatCurrency(item.price)}/-</p>

                                        </div>
                                    </div>
                                    <div className="pr-2 md:pr-8 mt-10 md:mt-0 mb-2 flex flex-col items-end ">
                                        <div className="ml-4">
                                            <p className="font-semibold">
                                                Quantity: {item.qty}
                                            </p>
                                            <p className="mt-2">
                                                Total Price: {formatCurrency(Number(item.qty) * Number(item.price))}
                                            </p>

                                        </div>
                                    </div>
                                    <hr className="h-px bg-gray-900 mb-2" />
                                </div>
                            ))}
                        </div>

                    )
                })}
            </div>
        </div>
    );
};


export default ProfilePage;
