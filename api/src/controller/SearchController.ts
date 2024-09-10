import Product from "../modals/Product";
import { Request, Response } from "express";

export const search = async (_req: Request, res: Response) => {
  try {
    let name = _req.params.name;

    name = name.replace(/-/g, " ");

    const products = await Product.find({ name: new RegExp(name, "i") });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
