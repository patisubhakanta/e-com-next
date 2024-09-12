

import { Request, Response } from 'express';
import User from '../modals/User';



export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;


        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user: { id: user._id, username, email } });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
