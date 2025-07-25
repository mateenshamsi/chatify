import * as jwt from 'jsonwebtoken';
import { Response } from 'express';
export const generateToken = (userId: string,res:Response): string => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET || '', {
        expiresIn: '7d'
    });
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        sameSite:'lax' ,
        secure: process.env.NODE_ENV === 'production' 
    })
    return token;
}