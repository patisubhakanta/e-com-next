import { ERROR_MESSAGE } from "../constatnts/messages";
import { PRICE_SORT } from "../constatnts/sort";
import Product from "../modals/Product";
import { IProduct } from "../types/Types";
import { Request, Response } from "express";

/**
 * @function allProducts
 * @description This function retrieves all products from the database and sorts them based on the price, if a sorting query is provided. 
 * It supports sorting by price in ascending (low to high) or descending (high to low) order.
 * 
 * @param {Request} req - Express request object, potentially containing a "sort" query parameter to define the sorting order.
 * @param {Response} res - Express response object used to send the response with the sorted list of products.
 * 
 * @returns {Promise<Response>} - Returns a list of products sorted by price, or an error message if any issues occur.
 * 
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const allProducts = async (req: Request, res: Response) => {
  try {
    const sortQuery = req.query.sort as string; // Get the sort query from request
    let sortOption = {};

    // Determine sorting based on query parameter
    if (sortQuery === PRICE_SORT.LOW_TO_HIGH) {
      sortOption = { price: 1 }; // Ascending order (low to high)
    } else if (sortQuery === PRICE_SORT.HIGH_TO_LOW) {
      sortOption = { price: -1 }; // Descending order (high to low)
    }

    // Fetch products from the database with the sorting option
    const products: IProduct[] = await Product.find().sort(sortOption);

    // Send the sorted products back in response
    res.json(products);
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
