import Product from "../modals/Product";
import { Request, Response } from "express";

export const productDetails = async (_req: Request, res: Response) => {
  try {
    const product = await Product.findById(_req.params.id);
    if (!product) res.status(400).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
