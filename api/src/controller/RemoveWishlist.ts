import { Request, Response } from 'express';
import Wishlist from '../modals/Wishlist';
import { verifyToken } from '../utils/tokenUtils';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';

/**
 * @function removeWishlist
 * @description This function handles the removal of a product from the user's wishlist. 
 * It verifies the user's token, checks if the wishlist exists, and removes the specified product if it is found.
 * 
 * @param {Request} req - Express request object, expecting the product ID to be removed in the request body.
 * @param {Response} res - Express response object used to send the response confirming the removal or an error message.
 * 
 * @returns {Promise<Response>} - Returns a success message if the product is removed, or an error message if the product is not found or any issues occur.
 * 
 * @throws {401} - If the user is unauthorized (invalid or missing token).
 * @throws {404} - If the user is not found or the wishlist does not exist.
 * @throws {400} - If the product with the specified ID is not found in the wishlist.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */

export const removeWishlist = async (req: Request, res: Response) => {
    const { _id }: { _id: string } = req.body; // Expecting a product Id 

    try {
        // Find the user by userId to get the username
        const decoded = verifyToken(req);
        if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
        if (!decoded.userId) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.USER_NOT_FOUND});
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
                return res.status(200).json(SUCESS_MESSAGE.REMOVE_WISHLIST[200]);
            } else {
                // If the product does not exist,
                return res.status(400).json(ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND);
            }
        }

    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
