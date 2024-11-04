import { Request, Response } from 'express';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import User from '../modals/userModal';

/**
 * @function signup
 * @description This function handles user registration by creating a new user in the database. 
 * It checks for the presence of required fields (username, email, password), verifies that the email is not already in use, 
 * and saves the new user if all validations pass.
 * 
 * @param {Request} req - Express request object, expecting the user's username, email, and password in the request body.
 * @param {Response} res - Express response object used to send the response confirming successful registration or an error message.
 * 
 * @returns {Promise<Response>} - Returns a success message with the newly created user's information if registration is successful, 
 * or an error message if any validations fail or an issue occurs.
 * 
 * @throws {400} - If any required fields (username, email, password) are missing.
 * @throws {401} - If the email is already associated with an existing user.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: ERROR_MESSAGE.SIGN_UP[400] });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: ERROR_MESSAGE.SIGN_UP[401] });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: SUCESS_MESSAGE.SIGN_UP[201], user: { id: user._id, username, email } });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
