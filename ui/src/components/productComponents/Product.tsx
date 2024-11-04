import { useState, useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/16/solid";
import useProducts from "../../hooks/useProducts";
import ProductSkeleton from "../skeleton/ProductLoading";
import ErrorUI from "../error";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { IProduct } from "@/types/Types";
import debounce from "lodash/debounce"; 
import useViewWishlist from "@/hooks/useViewWishlist";

const ProductPage = () => {
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const { wishlist  } = useViewWishlist()

  const { products, recommend, loading, error } = useProducts(selectedSort, query);

  // Use useEffect to debounce the inputValue changes
  useEffect(() => {
    const debouncedSearch = debounce((value: string) => {
      if (value.length >= 3) {
        setQuery(value.trim().replace(" ", "-"));
      } else {
        setQuery("");
      }
    }, 700); 

    // Call the debounced function with the current input value
    debouncedSearch(inputValue);

    // Cleanup function to cancel the debounced call on component unmount or inputValue change
    return () => {
      debouncedSearch.cancel();
    };
  }, [inputValue]);

  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSort(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // Update input value state
  };

  const clearFilters = () => {
    setSelectedSort("");
    setInputValue(""); // Clear input field as well
    setQuery(""); // Clear the query
  };

  // if (loading) return <ProductSkeleton />;
  if (error) return <ErrorUI message={error} />;

  return (
    <div id="product">
      <div className="w-full flex flex-col justify-center items-center py-10">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between">
          <div className="flex justify-center items-center mt-4">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search..."
              className="border border-gray-300 rounded-l px-4 py-2 w-64 outline-none"
            />
          </div>
          <div className="flex items-start px-4 py-8">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="low-to-high"
                checked={selectedSort === "low-to-high"}
                onChange={handleSortChange}
                className="form-radio"
              />
              <span>Low to High</span>
            </label>
            <label className="flex items-center space-x-2 mx-4">
              <input
                type="radio"
                value="high-to-low"
                checked={selectedSort === "high-to-low"}
                onChange={handleSortChange}
                className="form-radio"
              />
              <span>High to Low</span>
            </label>
            {selectedSort && <button onClick={clearFilters}><XCircleIcon className="w-6 h-6" /></button>}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8 w-full">
          {!loading ? products.map((product: IProduct) => (
            <Link passHref href={`/product/${product._id}`} key={product._id}>
              <ProductCard product={product} wishlisAPI={wishlist} />
            </Link>
          )) :  Array.from({ length: 6 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>

        {recommend.length > 0 && (
          <div className="w-full flex flex-col items-center">
            <h2>Recommended</h2>
            <hr />
            <div className="w-full">
              {recommend.map((product: IProduct) => (
                <Link passHref href={`/product/${product._id}`} key={product._id}>
                  <ProductCard product={product} wishlisAPI={wishlist} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
