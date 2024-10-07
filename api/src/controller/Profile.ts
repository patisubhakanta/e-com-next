import { Request, Response } from 'express';
import User from '../modals/User';
import Order from '../modals/Order';


export const getUserOrders = async (req: Request, res: Response) => {
  const userId = req.params.userId; // Get userId from URL parameters

  try {
    // Find the user by userId to get the username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all orders associated with the userId
    const orders = await Order.find({ userId: userId });

    return res.status(200).json({
      username: user.username,
      orders: orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
