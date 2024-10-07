import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IOrderItem } from '../types/Types';
import Order from '../modals/Order';

export const placeOrder = async (req: Request, res: Response) => {
    const { products } = req.body;

    try {
        // Verify the token
        const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

        // Create an order object
        const orderItems: IOrderItem[] = products.map((product: any) => ({
            productId: product.productId,
            qty: product.qty,
            price: product.price,
            total: product.qty * product.price,
            productImage: product.productImage, // Ensure to send product image in request
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

        return res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        console.error('Order placement error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
