import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../types/Types';

// Create the order schema
const orderSchema = new Schema<IOrder>({
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
});

// Create the Order model
const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;
