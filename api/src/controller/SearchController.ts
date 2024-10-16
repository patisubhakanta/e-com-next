import { ERROR_MESSAGE } from "../constatnts/messages";
import Product from "../modals/Product";
import { Request, Response } from "express";

/**
 * @function search
 * @description This function searches for products based on a provided name. 
 * It replaces hyphens with spaces, creates a regex for matching product names, and fetches products from the database.
 * It also calculates the average price of the found products and recommends additional products within a specified price range, excluding those already found.
 * 
 * @param {Request} _req - Express request object, expecting the product name as a URL parameter.
 * @param {Response} res - Express response object used to send the response with the search results or an error message.
 * 
 * @returns {Promise<Response>} - Returns a list of matching products and recommended products if found, or an error message if no products are found or any issues occur.
 * 
 * @throws {404} - If no products matching the search criteria are found.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const search = async (_req: Request, res: Response) => {
  try {
    let name = _req.params.name;

    name = name.replace(/-/g, " ");
    const keywords = name.replace(/-/g, " ").split(" ");
    const regex = new RegExp(keywords.join("|"), "i");
    const products = await Product.find({ name: new RegExp(name, "i") });

    if (products.length === 0) {
      return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND });
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
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
