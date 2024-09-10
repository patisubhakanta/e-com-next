import Product from "../modals/Product";
import { Request, Response } from "express";

export const addProducts = async (_req: Request, res: Response) => {
  try {
    const product = new Product(_req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
