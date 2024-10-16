import { ERROR_MESSAGE } from "../constatnts/messages";
import Product from "../modals/Product";
import { Request, Response } from "express";

/**
 * @function productDetails
 * @description This function retrieves the details of a specific product from the database using its ID. 
 * If the product is not found, it returns an error message.
 * 
 * @param {Request} _req - Express request object, expecting the product ID in the request parameters.
 * @param {Response} res - Express response object used to send the response with the product details or an error message.
 * 
 * @returns {Promise<Response>} - Returns the product details if found, or an error message if the product is not found or an error occurs.
 * 
 * @throws {400} - If the product with the provided ID is not found.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const productDetails = async (_req: Request, res: Response) => {
  try {
    const product = await Product.findById(_req.params.id);
    if (!product) res.status(400).json({ message: ERROR_MESSAGE.COMMON_ERROR.PRODUCT_NOT_FOUND  });
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
