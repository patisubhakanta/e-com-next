import useViewWishlist from "../../hooks/useViewWishlist";

import WishlistItemCard from "./WishlistCard";
import ProductSkeleton from "../Skeleton/ProductLoading";
import ErrorUI from "../Error";
import { useWishlist } from "../../context/WishlistContext";

const WishListItems = () => {
    const { error, loading, wishlist: wishlistAPI } = useViewWishlist();
    const { wishlist } = useWishlist()

    if (loading) return <ProductSkeleton />;
    if (error) return <ErrorUI message={error} />;

    return (
        <>
            {wishlist && wishlist.length ?
                <div className="mt-[50px] md:mt-[70px] h-[70vh]">
                    {wishlistAPI && wishlistAPI.map((product: any) => {
                        return wishlist.includes(product._id) && (
                            <div key={product._id} className="px-4">
                                <WishlistItemCard product={product} />
                            </div>
                        )
                    })}

                </div> : <div className="mt-[200px] h-[70vh]"> No product added</div>}
        </>
    );
};

export default WishListItems;