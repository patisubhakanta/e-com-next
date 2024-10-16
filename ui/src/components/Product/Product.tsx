import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/16/solid";

import ProductCard from "./ProductCard";
import useProducts from "../../hooks/useProducts";
import { IProduct } from "../../types/Types";
import { API } from "../../route/Route";
import ErrorUI from "../Error";
import ProductSkeleton from "../Skeleton/ProductLoading";


const ProductPage = () => {
    const [selectedSort, setSelectedSort] = useState<string>('');
    const { products, loading, error } = useProducts(selectedSort);

    const [query, setQuery] = useState<string>('');

    const [data, setData] = useState<IProduct[]>([])
    const [recommend, setRecommend] = useState<IProduct[]>([])

    const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedSort(event.target.value);
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
            const response: any = await axios.get(API.PRODUCTS.SEARCH.replace("{0}", productName), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setData(response.data.products)
            setRecommend(response.data.recommend)
        } catch (error) {
            console.error('Error while searching for the product:', error);
            throw error;
        }
    };

    if (loading) return <ProductSkeleton />;

    if (error) return <ErrorUI message={error} />;

    return (
        <>
            <div className="max-w-[1600px] mx-0 my-auto px-0 py-0 w-[100%] bg-[#fffdf9]">
                <div className="w-full flex flex-col justify-center items-center py-10">
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
                        <div className="flex items-start px-4 py-8">
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
                    <div className="w-full">
                        {data.length && data.map((product: IProduct, index) => {
                            return (
                                <Link to={`/product/${product._id}`} key={product._id}>
                                    <ProductCard product={product} />
                                </Link>
                            )
                        })}
                    </div>
                    {recommend.length ?
                        <div className="w-full flex flex-col items-center">
                            <div>
                                Recommend
                            </div>
                            <hr />
                            <div className="w-full">
                                {recommend.length && recommend.map((product: IProduct, index) => {
                                    return (
                                        <Link to={`/product/${product._id}`} key={product._id}>
                                            <ProductCard product={product} />
                                        </Link>
                                    )
                                })}
                            </div>
                        </div> : null}
                </div>
            </div>


        </>
    );
};

export default ProductPage;
