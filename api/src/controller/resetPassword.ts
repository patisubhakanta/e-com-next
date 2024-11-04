import { Request, Response } from 'express';
import { ERROR_MESSAGE, SUCESS_MESSAGE } from '../constatnts/messages';
import User from '../modals/userModal';

/**
 * @function forgetPassword
 * @description This function handles the process of updating a user's password when they forget it. 
 * It locates the user by their email, updates their password, and saves the changes to the database.
 * 
 * @param {Request} req - Express request object, expecting the user's email and new password in the request body.
 * @param {Response} res - Express response object used to send the response.
 * 
 * @returns {Promise<Response>} - Returns a success message if the password is updated, or an error message if the user is not found or any server error occurs.
 * 
 * @throws {404} - If the user with the provided email is not found.
 * @throws {500} - If an error occurs during the database operation or any other server issue.
 */


export const forgetPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: ERROR_MESSAGE.COMMON_ERROR.USER_NOT_FOUND });
        }
        // Update the user's password
        user.password = newPassword;
        await user.save();
        return res.status(200).json({ message: SUCESS_MESSAGE.FORGET_PASSWORD[200]  });
    } catch (error) {
        return res.status(500).json({ message: ERROR_MESSAGE.COMMON_ERROR[500] });
    }
};
