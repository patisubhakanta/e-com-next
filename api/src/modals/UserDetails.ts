

import { Request, Response } from 'express';
import User from './User';



export const getUserDetailsById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('cart.productId', 'name price')
            .populate('orders.productId', 'name price');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            cart: user.cart,
            orders: user.orders,
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
