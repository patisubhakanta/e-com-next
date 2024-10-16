import { ERROR_MESSAGE } from "../constatnts/messages";
import Product from "../modals/Product";
import { Request, Response } from "express";

/**
 * @function addProducts
 * @description This function handles the addition of a new product to the database.
 * It accepts an HTTP request object that contains product details, saves the product to the database,
 * and sends the saved product back in the response.
 * 
 * @param {Request} _req - Express request object, which contains the product data in the body.
 * @param {Response} res - Express response object used to send the response.
 * 
 * @returns {Promise<Response>} - Returns a response containing the newly created product or an error message.
 * 
 * @throws {500} - If an error occurs during the saving process, a 500 HTTP status is returned 
 * along with a common error message.
 */

export const addProducts = async (_req: Request, res: Response) => {
  try {
    const product = new Product(_req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
