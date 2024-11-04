import { Request, Response } from 'express';
import { verifyToken } from '../middleware/tokenUtils';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import Wishlist from '../modals/wishlistModal';

/**
 * @function addWishlistItems
 * @description This function adds a product to the user's wishlist. It verifies the user's token, checks if a wishlist already exists for the user,
 * and either updates the existing wishlist or creates a new one.
 * 
 * @param {Request} req - Express request object, expecting the product ID in the request body.
 * @param {Response} res - Express response object used to send the response.
 * 
 * @returns {Promise<Response>} - Returns a success message and product ID if the product is added, or an error message if the product already exists or an error occurs.
 * 
 * @throws {401} - If the user is unauthorized (invalid or missing token).
 * @throws {400} - If the product already exists in the user's wishlist.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const addWishlistItems = async (req: Request, res: Response) => {
    const { _id }: { _id: string } = req.body; // Expecting a product Id 

    try {
        // Verify the token
        const decoded = verifyToken(req);
        if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });

        // Find the user's existing wishlist document or create a new one if it doesn't exist
        let wishlist = await Wishlist.findOne({ userId: decoded.userId });

        if (wishlist) {
            // Check if the product already exists in the wishlist
            const productExists = wishlist.orders.find(order => order.productId === _id);

            if (productExists) {
                return res.status(400).json({ message: ERROR_MESSAGE.WISHLIST.ADD[400] });
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

        return res.status(201).json({ message: SUCESS_MESSAGE.WISHLIST.ADD[201], _id });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
