import { Request, Response } from 'express';
import { ERROR_MESSAGE } from '../constatnts/messages';
import { getFullOrderDetails } from '../utils/orderUtils';
import Order from '../modals/orderModal';
import User from '../modals/userModal';

/**
 * @function getUserOrders
 * @description This function retrieves all orders associated with a specific user. 
 * It first finds the user by their ID, then fetches the user's orders, and retrieves the full details of each order.
 * 
 * @param {Request} req - Express request object, expecting the user ID in the request parameters.
 * @param {Response} res - Express response object used to send the response containing the user's orders or an error message.
 * 
 * @returns {Promise<Response>} - Returns the username and an array of the user's full order details if found, 
 * or an error message if the user or orders are not found or any error occurs.
 * 
 * @throws {404} - If the user with the provided ID is not found or if no orders are associated with the user.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */

export const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Get userId from URL parameters

  try {
    // Find the user by userId to get the username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.USER_NOT_FOUND });
    }

    // Find all orders associated with the userId
    const orders = await Order.find({ userId: userId }).sort({ "orders.timestamp": -1 });

    if (!orders) {
      return res.status(404).json({ message: ERROR_MESSAGE.ORDER[404] });
    }

    // Fetch full product details for each order and item
    const fullOrderDetails = await getFullOrderDetails(orders);

    return res.status(200).json({
      username: user.username,
      orders: fullOrderDetails,
    });

  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
