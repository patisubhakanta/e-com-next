import { Request, Response } from 'express';
import { verifyToken } from '../middleware/tokenUtils';
import Cart from '../modals/cart';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';


/**
 * @function removeCartItem
 * @description Decreases the quantity of a product in the user's cart. If the quantity reaches zero, removes the product.
 * 
 * @param {Request} req - Express request object, expecting the product ID in the request body.
 * @param {Response} res - Express response object for sending responses.
 * 
 * @returns {Promise<Response>} - A success or error response.
 */
export const removeCartItem = async (req: Request, res: Response) => {
    const { productId }: { productId: string } = req.body; // Expecting product ID in the request body
    const decoded = verifyToken(req);
    if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });

    try {
        // Find the user's cart
        const cart = await Cart.findOne({ userId: decoded.userId });
        if (!cart) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND });
        }

        // Locate the product in the cart
        const itemIndex = cart.items.findIndex(item => item.productId === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND });
        }

        // Decrease the quantity or remove the item if quantity reaches zero
        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1; // Decrease quantity by 1
        } else {
            cart.items.splice(itemIndex, 1); // Remove item if quantity is 1
        }

        await cart.save();

        return res.status(200).json({ message: SUCESS_MESSAGE.CART[200], productId });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
