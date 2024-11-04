import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './tokenUtils';
import { ERROR_MESSAGE } from '../constatnts/messages';
import User from '../modals/userModal';


export const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decoded = verifyToken(req);
        if (!decoded) {
            return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
        }

        // Fetch the user from the database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: ERROR_MESSAGE.COMMON_ERROR.Unauthorized });
    }
};
