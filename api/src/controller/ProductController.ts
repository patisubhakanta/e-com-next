import Product from "../modals/Product";
import { IProduct } from "../types/Types";
import { Request, Response } from "express";

export const allProducts = async (req: Request, res: Response) => {
  try {
    const sortQuery = req.query.sort as string; // Get the sort query from request
    let sortOption = {};

    // Determine sorting based on query parameter
    if (sortQuery === "low-to-high") {
      sortOption = { price: 1 }; // Ascending order (low to high)
    } else if (sortQuery === "high-to-low") {
      sortOption = { price: -1 }; // Descending order (high to low)
    }

    // Fetch products from the database with the sorting option
    const products: IProduct[] = await Product.find().sort(sortOption);

    // Send the sorted products back in response
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
