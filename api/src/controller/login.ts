import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Cart from '../modals/cart';
import { ERROR_MESSAGE } from '../constatnts/messages';
import { getFullCartDetails } from '../utils/getCartDetails'; 
import User from '../modals/userModal';

/**
 * @function signin
 * @description This function handles user sign-in by verifying the provided email and password. 
 * It checks for the presence of credentials, retrieves the user from the database, compares the hashed password, 
 * generates a JSON Web Token (JWT) for authenticated access, and retrieves the user's cart details.
 * 
 * @param {Request} req - Express request object, expecting the user's email and password in the request body.
 * @param {Response} res - Express response object used to send the response containing the JWT, user information, and cart details, or an error message.
 * 
 * @returns {Promise<Response>} - Returns a JWT, user information, and cart details upon successful sign-in, or an error message if any issues occur.
 * 
 * @throws {400} - If either email or password is not provided.
 * @throws {401} - If the user is not found or if the password does not match the stored hash.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: ERROR_MESSAGE.SIGN_IN[400] });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: ERROR_MESSAGE.SIGN_IN[401] });
    }

    // Compare provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: ERROR_MESSAGE.SIGN_IN[401] });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    // Retrieve the user's cart details
    const cart = await Cart.findOne({ userId: user._id });


    // Fetch full product details for each item in the cart
    const fullCartDetails = cart && cart.items.length > 0 ?  await getFullCartDetails(cart.items): []

    // Send response with the token, user info, and cart details
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      cart: fullCartDetails
    });
  } catch (error) {
    return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
  }
};
