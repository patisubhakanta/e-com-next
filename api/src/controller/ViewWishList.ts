import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Wishlist from '../modals/Wishlist';
import Product from '../modals/Product';
import { IWishlist } from '../types/Types';


export const viewWishlist = async (req: Request, res: Response) => {

    try {
        // Find the user by userId to get the username
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        if (!decoded.userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all orders associated with the userId
        const wishlist = await Wishlist.find({ userId: decoded.userId }) as IWishlist[];

        // Get product details for each order in the wishlist
        const fullProductDetails = await Promise.all(
            wishlist.flatMap((wishlistItem) =>
                wishlistItem.orders.map(async (order) => {
                    console.log(order)
                    const product = await Product.findById(order.productId);
                    return product;
                })
            )
        );
        return res.status(200).json(fullProductDetails);

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
