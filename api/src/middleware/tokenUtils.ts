
import jwt from 'jsonwebtoken';
import { Request } from 'express';

export const verifyToken = (req: Request): { userId: string } | null => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer token
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
};
