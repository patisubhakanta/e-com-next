import Product from '../modals/productModal';
import Wishlist from '../modals/wishlistModal';
import { IWishlist } from '../types/Types';

// Function to get full product details from the wishlist
export const getProductDetailsFromWishlist = async (userId: string): Promise<any[]> => {
    const wishlist = await Wishlist.find({ userId }) as IWishlist[];

    // Get product details for each order in the wishlist
    const fullProductDetails = await Promise.all(
        wishlist.flatMap((wishlistItem) =>
            wishlistItem.orders.map(async (order) => {
                const product = await Product.findById(order.productId);
                return product;
            })
        )
    );

    return fullProductDetails;
};
