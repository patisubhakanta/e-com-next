"use client";
import useViewWishlist from "../../hooks/useViewWishlist";

import ErrorUI from "../error";
import { useWishlist } from "../../context/WishlistContext";
import WishlistItemCard from "./WishlistCard";
import { IProduct } from "@/types/Types";
import ProductSkeleton from "../skeletonComponents/ProductLoading";

const WishListItems = () => {
    const { error, loading, wishlist: wishlistAPI } = useViewWishlist();
    const { wishlist } = useWishlist()

    if (loading) return <ProductSkeleton />;
    if (error) return <ErrorUI message={error} />;

    return (
        <>
            {wishlist && wishlist.length ?
                <div className="mt-[50px] md:mt-[70px] h-[70vh]">
                    {wishlistAPI && wishlistAPI.map((product: IProduct) => {
                        return wishlist.includes(product._id) && (
                            <div key={product._id} className="px-4">
                                <WishlistItemCard product={product} />
                            </div>
                        )
                    })}

                </div> : <h3 className="mt-[200px] h-[70vh]"> No product added</h3>}
        </>
    );
};

export default WishListItems;