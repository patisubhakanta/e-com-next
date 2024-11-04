import mongoose, { Schema, Document } from 'mongoose';
import { IOrder } from '../types/Types';

// Define the structure of order items
interface IOrderItem {
    productId: string;
    qty: number;
    price: number;
}

// Define the structure of each order with timestamp
interface IOrderDetail {
    timestamp: Date;
    orders: IOrderItem[];
}

// Extend the Document interface for TypeScript
interface IOrderDocument extends Document {
    userId: string;
    items: IOrderDetail[];
    createdAt: Date; // To track when the order was created
    updatedAt: Date; // To track the last update of the order
}

// Create the order schema
const orderSchema = new Schema<IOrderDocument>({
    userId: { type: String, required: true },
    items: [
        {
            timestamp: { type: Date, default: Date.now },
            orders: [
                {
                    productId: { type: String, required: true },
                    qty: { type: Number, required: true },
                    price: { type: Number, required: true },
                },
            ],
        },
    ],
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Create the Order model
const Order = mongoose.model<IOrderDocument>('Order', orderSchema);
export default Order;
