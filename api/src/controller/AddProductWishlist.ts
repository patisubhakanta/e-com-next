import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Wishlist from '../modals/Wishlist';
import { IOrderItem } from '../types/Types';

export const addWishlistItems = async (req: Request, res: Response) => {
    const { _id }: { _id: string } = req.body; // Expecting a product Id 

    try {
        // Verify the token
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Find the user's existing wishlist document or create a new one if it doesn't exist
        let wishlist = await Wishlist.findOne({ userId: decoded.userId });

        if (wishlist) {
            // Check if the product already exists in the wishlist
            const productExists = wishlist.orders.find(order => order.productId === _id);

            if (productExists) {
                return res.status(400).json({ message: 'Product already added to wishlist' });
            } else {
                // If the product does not exist, add it to the orders array
                wishlist.orders.push({ productId: _id });
            }
        } else {
            // Create a new wishlist if none exists for the user
            wishlist = new Wishlist({
                userId: decoded.userId,
                orders: [{ productId: _id }],
            });
        }

        // Save the updated or newly created wishlist document
        await wishlist.save();

        return res.status(201).json({ message: 'Product added to wishlist successfully', _id });
    } catch (error) {
        console.error('Wishlist error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
