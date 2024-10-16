import { Request, Response } from 'express';
import { verifyToken } from '../utils/tokenUtils';
import { ERROR_MESSAGE } from '../constatnts/messages';
import { getProductDetailsFromWishlist } from '../utils/wishlistUtils';

/**
 * @function viewWishlist
 * @description This function retrieves and displays the user's wishlist. 
 * It verifies the user's token to ensure they are authenticated, 
 * then fetches the product details for each item in the user's wishlist.
 * 
 * @param {Request} req - Express request object used to extract the user's token from the request.
 * @param {Response} res - Express response object used to send the response containing the wishlist items or an error message.
 * 
 * @returns {Promise<Response>} - Returns the full product details of the items in the user's wishlist, 
 * or an error message if the user is not authorized or any other issues occur.
 * 
 * @throws {401} - If the user is unauthorized (invalid or missing token).
 * @throws {404} - If the user ID cannot be found.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */

export const viewWishlist = async (req: Request, res: Response) => {

    try {
        // Find the user by userId to get the username
        const decoded = verifyToken(req);
        if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
        if (!decoded.userId) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND });
        }

        // Get product details for each order in the wishlist
        const fullProductDetails = await getProductDetailsFromWishlist(decoded.userId);
        return res.status(200).json(fullProductDetails);

    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
