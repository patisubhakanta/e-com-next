"use client";
import useFetchOrder from '../hooks/useFetchOrder';
import { formatCurrency } from '../utils';

const ProfilePage = () => {
    const { data } = useFetchOrder()
    console.log(data?.orders[0])
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleString('en-US', options);
    };

    return (
        <div className="mt-[200px] h-[70vh]">
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

                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                {data && data?.orders[0] && data?.orders[0]?.items && data.orders[0].items.map((order: any, index: number) => {
                    return (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <div className="w-full justify-end flex items-center">
                            <p className="text-gray-800">
                                {formatTimestamp(order.timestamp)}
                            </p>
                            </div>
                            <hr className="my-4 h-0.5 bg-gray-900" />
                            {order?.orders && order.orders.map((item: any) => (
                                <div key={item.timestamp} className="mb-4">
                                    <div className="flex items-center">
                                        <img
                                            src={item.
                                                productImage}
                                            alt="Product"
                                            className="w-16 h-16 rounded border border-gray-200 h-24 object-contain"
                                        />

                                        <div className="ml-4">
                                            <p className="font-semibold">
                                                Quantity: {item.qty}
                                            </p>
                                            <p className="mt-2">
                                                Price: {formatCurrency(item.total)}
                                            </p>

                                        </div>
                                    </div>
                                    <hr className="my-4" />
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
