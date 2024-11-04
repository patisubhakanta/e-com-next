import { Request, Response } from 'express';
import Cart from '../modals/cart';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import { verifyToken } from '../middleware/tokenUtils';

/**
 * @function addCartItems
 * @description Adds multiple unique products to the user's cart, allowing for specified quantities.
 * 
 * @param {Request} req - Express request object, expecting an array of product objects with IDs and quantities in the body.
 * @param {Response} res - Express response object for sending responses.
 * 
 * @returns {Promise<Response>} - A success or error response.
 */
export const addCartItems = async (req: Request, res: Response) => {
    const { items }: { items: { productId: string; quantity: number }[] } = req.body; // Expecting an array of objects with productId and quantity
    const decoded = verifyToken(req);
    
    if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });

    try {
        // Find or create the cart for the user
        let cart = await Cart.findOne({ userId: decoded.userId });
        
        if (cart) {
            // Create a map of existing product IDs and their quantities
            const existingItemsMap = new Map(cart.items.map((item: any) => [item.productId, item]));

            items.forEach(({ productId, quantity }) => {
                if (existingItemsMap.has(productId)) {
                    // If the product already exists, update the quantity
                    existingItemsMap.get(productId).quantity += quantity; // Increment the quantity
                } else {
                    // If the product does not exist, add it to the cart
                    existingItemsMap.set(productId, { productId, quantity });
                }
            });

            // Convert the map back to an array
            cart.items = Array.from(existingItemsMap.values());
        } else {
            // Create a new cart with the provided items
            cart = new Cart({
                userId: decoded.userId,
                items: items.map(({ productId, quantity }) => ({ productId, quantity })),
            });
        }

        await cart.save();

        return res.status(201).json({ message: SUCESS_MESSAGE.CART[201], items });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
