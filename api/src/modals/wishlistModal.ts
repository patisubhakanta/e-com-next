import mongoose, { Schema } from 'mongoose';
import { IWishlist } from '../types/Types';

// Create the Wishlist schema
const wishlistSchema = new Schema<IWishlist>({
    userId: { type: String, required: true },
    orders: [
        {
            productId: { type: String, required: true },
        },
    ],

});

// Create the Wishlist model
const Wishlist = mongoose.model<IWishlist>('wishlist', wishlistSchema);
export default Wishlist;
