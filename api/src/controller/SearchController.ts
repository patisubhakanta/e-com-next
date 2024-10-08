import Product from "../modals/Product";
import { Request, Response } from "express";

export const search = async (_req: Request, res: Response) => {
  try {
    let name = _req.params.name;

    name = name.replace(/-/g, " ");
    const keywords = name.replace(/-/g, " ").split(" ");
    const regex = new RegExp(keywords.join("|"), "i");
    const products = await Product.find({ name: new RegExp(name, "i") });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    const averagePrice = products.reduce((acc, product) => acc + product.price, 0) / products.length;
    const recommend = await Product.find({
      $and: [
        {
          price: {
            $gte: averagePrice - 5000,
            $lte: averagePrice + 5000,
          }
        },
        { name: regex },
        // Exclude products already in the main search result
        { _id: { $nin: products.map((p) => p._id) } }
      ]
    });

    res.json({ products, recommend });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
