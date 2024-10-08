import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Wishlist from '../modals/Wishlist';

export const removeWishlist = async (req: Request, res: Response) => {
    const { _id }: { _id: string } = req.body; // Expecting a product Id 

    try {
        // Find the user by userId to get the username
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        if (!decoded.userId) {
            return res.status(404).json({ message: 'User not found' });
        }

        let wishlist = await Wishlist.findOne({ userId: decoded.userId });
        if (wishlist) {
            // Check if the product already exists in the wishlist
            const productExists = wishlist.orders.find(order => order.productId === _id);

            if (productExists) {
                await Wishlist.updateOne(
                    { userId: decoded.userId },
                    { $pull: { orders: { productId: _id } } } // Remove the order with matching productId
                );
                return res.status(200).json("Product Removed from Wishlist");
            } else {
                // If the product does not exist,
                return res.status(200).json("Product Removed from Wishlist");
            }
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};
