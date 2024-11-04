import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "../types/Types";

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  image: { type: String },
});


const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;