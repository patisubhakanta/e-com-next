"use client";
import { useRouter } from "next/navigation";
import useFetchOrder from "../../hooks/useFetchOrder";
import { formatCurrency, formatTimestamp, getOrderStatus } from "../../utils";
import withAuth from "../auth/withAuth";
import Link from "next/link";
import { IProduct, OrderProductDTO } from "@/types/Types";

const ProfilePage = () => {
    const router = useRouter();
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
                            <h1 data-testid="userName" className="text-2xl font-semibold">{data?.username || ""}</h1>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center mb-8">
                    <button role="button" onClick={() => {
                        router.push("/wishlist")
                    }} className="bg-blue-500 text-white px-6 py-2 mt-4 rounded hover:bg-blue-600">Wishlist</button>
                </div>

                <h2 className="text-xl font-semibold mb-4">Order History</h2>
                {data && data?.orders[0] && data?.orders[0]?.items && data.orders[0].items.map((order: OrderProductDTO, index: number) => {
                    const totalOrderPrice = order.orders.reduce((total: number, item: IProduct) => total + Number(item.qty) * item.price, 0);

                    return (
                        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
                            <div className="w-full justify-between flex flex-col md:flex-row items-stear md:items-center px-4">

                                <div className="w-full flex items-center justify-between">
                                    <div>
                                        <h6 className="text-sm text-gray-600 font-semibold">
                                            Order Status
                                        </h6>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-green-600" id="shipped-dot"></div>
                                            <span className="text-gray-700 text-sm">{getOrderStatus(order.timestamp)}</span>
                                        </div>
                                    </div>
                                    <div >
                                        <h6 className="text-sm text-gray-600 font-semibold">
                                            Date placed
                                        </h6>
                                        <p className="text-gray-800 text-sm">
                                            {formatTimestamp(order.timestamp)}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col items-start md:items-end mt-4 md:mt-0">
                                    <h6 className="text-sm text-gray-600 font-semibold">
                                        Total Price
                                    </h6>
                                    <p className="text-gray-800 text-sm">
                                        {formatCurrency(totalOrderPrice)}
                                    </p>
                                </div>


                            </div>
                            <hr className="my-4 h-0.5 bg-gray-900" />
                            {order?.orders && order.orders.map((item: IProduct) => (
                                <div key={item._id} className="max-w-full mx-auto py-4">

                                    <div className="mb-4 p-4 flex flex-col md:flex-row items-center justify-between">
                                        <div className="relative">
                                            <img className="w-32 h-32 object-contain rounded-lg" src={item.image} alt={item.name} />
                                        </div>
                                        <div className="flex-1 ml-6">
                                            <div className="w-full justify-between flex flex-col md:flex-row items-end md:items-center">
                                                <h2 className="text-md font-semibold text-gray-800">{item.name}</h2>
                                                <p className="text-md font-semibold text-gray-800">Quantity: {item.qty}</p>
                                            </div>
                                            <p className="text-gray-600 mt-2">{item.description}</p>
                                            <p className="text-md font-medium text-gray-800">{formatCurrency(item.price)}/-</p>

                                        </div>
                                    </div>
                                    <div className="pr-2 md:pr-8 mt-10 md:mt-0 mb-2 flex flex-col items-end ">
                                        <div className="ml-4">

                                            <Link passHref href={`/product/${item?.productId}`} className="text-sm font-semibold text-blue-800">
                                                View product
                                            </Link>
                                        </div>
                                    </div>
                                    <hr className="my-4 h-0.5 bg-gray-200" />
                                </div>
                            ))}
                        </div>

                    )
                })}
            </div>
        </div>
    );
};


export default withAuth(ProfilePage);
