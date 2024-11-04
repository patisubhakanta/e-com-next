import { ERROR_MESSAGE } from "../constatnts/messages";
import { PRICE_SORT } from "../constatnts/sort";
import Product from "../modals/productModal";
import { IProduct } from "../types/Types";
import { Request, Response } from "express";

/**
 * @function allProducts
 * @description This function retrieves products based on a search query and sorts them by price if a sorting option is provided. 
 * If a search term is present, it fetches products that match the search term and recommends additional products within a specified price range.
 * 
 * @param {Request} req - Express request object, potentially containing "sort" and "search" query parameters.
 * @param {Response} res - Express response object used to send the response with the list of products and recommended products if a search is performed.
 * 
 * @returns {Promise<Response>} - Returns products sorted by price, or search and recommended products if a search is performed. 
 * Returns an error message if any issues occur.
 * 
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */

export const allProducts = async (req: Request, res: Response) => {
  try {
    const sortQuery = req.query.sort as string;
    const search = req.query.search as string;
    let sortOption = {};

    // Determine sorting based on the query parameter
    if (sortQuery === PRICE_SORT.LOW_TO_HIGH) {
      sortOption = { price: 1 }; // Ascending order (low to high)
    } else if (sortQuery === PRICE_SORT.HIGH_TO_LOW) {
      sortOption = { price: -1 }; // Descending order (high to low)
    }

    let products: IProduct[] = [];
    let recommend: IProduct[] = [];

    if (search) {
      const searchTerm = search.replace(/-/g, " ");
      const keywords = searchTerm.replace(/-/g, " ").split(" ");
      const regex = new RegExp(keywords.join("|"), "i");
      const products = await Product.find({ name: new RegExp(searchTerm, "i") });

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

    } else {
      // If no search query, fetch all products with sorting
      products = await Product.find().sort(sortOption);
      recommend = []
      res.json({ products, recommend });
    }


  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
