import { Request, Response } from 'express';
import { IOrderItem } from '../types/Types';

import { verifyToken } from '../middleware/tokenUtils';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import Cart from '../modals/cart';
import Order from '../modals/orderModal';

/**
 * @function placeOrder
 * @description This function handles the placement of an order by a user. It verifies the user's token, processes the order details, 
 * and either updates an existing order document or creates a new one in the database.
 * 
 * @param {Request} req - Express request object, expecting an array of product details in the request body (product ID, quantity, price).
 * @param {Response} res - Express response object used to send the response.
 * 
 * @returns {Promise<Response>} - Returns a success message with the order details if the order is placed, or an error message if any issues occur.
 * 
 * @throws {401} - If the user is unauthorized (invalid or missing token).
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const placeOrder = async (req: Request, res: Response) => {
    const { products } = req.body;

    try {
        // Verify the token
        const decoded = verifyToken(req);
        if (!decoded) return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });

        // Create an order object
        const orderItems: IOrderItem[] = products.map((product: any) => ({
            productId: product.productId,
            qty: product.qty,
            price: product.price,
        }));

        // Create the order structure
        const newOrder = {
            timestamp: new Date(),
            orders: orderItems,
        };

        // Find the user's existing order document or create a new one if it doesn't exist
        let order = await Order.findOne({ userId: decoded.userId });

        if (order) {
            // If an order document already exists, push the new order into the items array
            order.items.push(newOrder);
        } else {
            // If no order document exists, create a new one
            order = new Order({
                userId: decoded.userId,
                items: [newOrder], // Add the new order as the first item
            });
        }

        // Save the updated order document
        await order.save();
        // Remove only ordered items from the cart
        const orderedProductIds = products.map((product: any) => product.productId);
        await Cart.findOneAndUpdate(
            { userId: decoded.userId },
            {
                $pull: {
                    items: { productId: { $in: orderedProductIds } }
                }
            }
        );

        return res.status(201).json({ message: SUCESS_MESSAGE.ORDER[201], order });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
