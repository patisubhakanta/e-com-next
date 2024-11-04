import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
    productId: string;
    quantity:number
}

interface CartDocument extends Document {
    userId: string;
    items: CartItem[];
}

const CartSchema = new Schema<CartDocument>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    items: [
        {
            productId: {
                type: String,
                required: true
            }, quantity: {
                type: Number,
                required: true,
                default:1
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model<CartDocument>('Cart', CartSchema);
export default Cart;
