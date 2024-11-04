import Cart from "../modals/cart";
import { Request, Response } from "express";
import { getFullCartDetails } from "../utils/getCartDetails";
import { ERROR_MESSAGE } from "../constatnts/messages";
import { verifyToken } from "../middleware/tokenUtils";

/**
 * @function getCartDetails
 * @description Retrieves all cart details associated with a specific user. 
 * It first finds the user by their ID, then fetches the user's cart, and retrieves the full details of each product in the cart.
 * 
 * @param {Request} req - Express request object, expecting the user ID in the request parameters.
 * @param {Response} res - Express response object used to send the response containing the user's cart details or an error message.
 * 
 * @returns {Promise<Response>} - Returns the username and an array of the user's cart details if found, 
 * or an error message if the user or cart is not found or any error occurs.
 * 
 * @throws {404} - If the user with the provided ID is not found or if the cart is empty.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */
export const getCartDetails = async (req: Request, res: Response) => {

    try {
        // Find the user by userId to get the username
        const decoded = verifyToken(req);
        if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
 
        // Find the user's cart associated with the userId
        const cart = await Cart.findOne({ userId :decoded.userId});
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND });
        }

        // Fetch full product details for each item in the cart
        const fullCartDetails = await getFullCartDetails(cart.items);

        return res.status(200).json({
            cart: fullCartDetails,
        });

    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};