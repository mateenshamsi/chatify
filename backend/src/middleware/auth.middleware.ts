import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import {Request,Response,NextFunction} from 'express';
export const protectRoute = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        if(!decoded || typeof decoded !== 'object' || !decoded.userId) {
            return res.status(401).json({ error: 'Not authorized, token invalid' });
        }
        const user = await User.findById(decoded.userId).select('-password');
        if(!user) {
            return res.status(401).json({ error: 'Not authorized, user not found' });
        }
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(401).json({ error: 'Not authorized, token failed' });
    }
}