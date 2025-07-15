import { Request, Response } from 'express';
import User from '../models/user.model';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { generateToken } from '../lib/utils';
import cloudinary from '../lib/cloudinary';
export const registerController = async (req:Request, res:Response) => {
    const { username, email, password } = req.body;
    try {
        if(password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }   
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password:hashedPassword// Note: Password should be hashed before saving in production
        });
        if(!newUser) {
            return res.status(500).json({ error: 'Failed to create user' });
        }
        const token =generateToken(newUser._id.toString(), res);
        await newUser.save();
        console.log('User created successfully:', newUser);
        return res.status(201).json({
            message: 'User created successfully',
            newUser})
  
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ error: 'An error occurred during signup' });
  }
}

export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne(email);
        if(!user){
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password!);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }
        const token = generateToken(user._id.toString(), res);
        return res.status(200).json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'An error occurred during login' });
    }
} 


export const logoutController = (req: Request, res: Response) => {
 try{ 
    res.cookie('jwt',"",{maxAge:0});
    return res.status(200).json({ message: 'Logout successful' });
 }
 catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ error: 'An error occurred during logout' });
 }
}

export const updateProfileController = async (req: Request, res: Response) => {
    try{
        const {profilePic} = req.body;
        const  userId=req.user?._id 
        const user = await User.findById(userId);
        const cloudinaryResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'chatty/profile_pictures',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            transformation: [{ width: 500, height: 500, crop: 'fill' }]
        });  
        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePicture: cloudinaryResponse.secure_url
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }      
    }
    catch (error) {
        console.error('Error during profile update:', error);
        return res.status(500).json({ error: 'An error occurred while updating the profile' });
    }  
} 