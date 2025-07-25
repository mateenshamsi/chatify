import * as jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

// Define the JWT payload interface
interface JWTPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                email: string;
                username: string;
                profilePicture?: string;
                // Add other user properties as needed
            };
        }
    }
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ error: 'Not authorized, no token' });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JWTPayload;
        
        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: 'Not authorized, token invalid' });
        }

        // Find user and exclude password
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ error: 'Not authorized, user not found' });
        }

        // Attach user to request object - THIS WAS MISSING!
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            // Add other properties you need
        };

        next();
        
    } catch (error) {
        console.error('Token verification failed:', error);
        
        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Not authorized, invalid token' });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Not authorized, token expired' });
        }
        
        return res.status(401).json({ error: 'Not authorized, token failed' });
    }
};