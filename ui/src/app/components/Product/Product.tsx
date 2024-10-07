"use client"
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import useProducts from "@/app/hooks/useProducts";
import { IProduct } from "@/app/types/Types";
import Link from "next/link";
import axios from "axios";
import { API } from "@/app/route/Route";
import { XCircleIcon } from "@heroicons/react/16/solid";

const ProductPage = () => {
    const [selectedSort, setSelectedSort] = useState<string>('');
    const { products, loading, error } = useProducts(selectedSort);

    const [query, setQuery] = useState<string>('');

    const [data, setData] = useState<IProduct[]>([])


    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSort(event.target.value); // Update selected sort value
    };


    useEffect(() => {
        setData(products)
    }, [products])


    const handleSearch = () => {
        if (query.trim()) {
            searchProduct(query.trim().replace(" ", "-"))
        } else {
            console.log('Please enter a search term');
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (e.target.value === "") {
            setData(products)
        }
    };

    const searchProduct = async (productName: string) => {
        try {
            const response = await axios.get(API.PRODUCTS.SEARCH.replace("{0}", productName), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data)
        } catch (error) {
            console.error('Error while searching for the product:', error);
            throw error;
        }
    };

    if (loading) return <p>Loading...</p>;

    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="max-w-[1600px] mx-0 my-auto px-0 py-0 w-[100%] bg-[#fffdf9]">
                <div className="w-full flex flex-col justify-center items-center mt-10 md:mt-20 py-20">
                    <div className="w-full flex flex-col item-center justify-center">
                        <div className="flex justify-center items-center mt-4">
                            <input
                                type="text"
                                value={query}
                                onChange={handleInputChange}
                                placeholder="Search..."
                                className="border border-gray-300 rounded-l px-4 py-2 w-64"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-r px-4 py-2"
                            >
                                Search
                            </button>
                        </div>
                        <div className="flex items-start p-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="low-to-high"
                                    checked={selectedSort === 'low-to-high'}
                                    onChange={handleSortChange}
                                    className="form-radio"
                                />
                                <span>Low to High</span>
                            </label>

                            <label className="flex items-center space-x-2 mx-4">
                                <input
                                    type="radio"
                                    value="high-to-low"
                                    checked={selectedSort === 'high-to-low'}
                                    onChange={handleSortChange}
                                    className="form-radio"
                                />
                                <span>High to Low</span>
                            </label>
                            {selectedSort ? <button onClick={() => {
                                setSelectedSort("");
                                setQuery("")
                            }}> <XCircleIcon className="w-6 h-6" /> </button> : null}

                        </div>

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                        {data.map((product: IProduct, index) => {
                            return (
                                <Link href={`/product/${product._id}`} passHref key={product._id}>
                                    <ProductCard product={product} />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
