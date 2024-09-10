import Product from "../modals/Product";
import { IProduct } from "../types/Types";
import { Request, Response } from "express";

export const allProducts = async (_req: Request, res: Response) => {
  try {
    const products: IProduct[] = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
