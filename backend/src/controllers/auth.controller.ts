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
            newUser,
            token
        });
  
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
    try {
        const { profilePic } = req.body;
        const userId = req.user?._id;
        
        // Validate required fields
        if (!profilePic) {
            return res.status(400).json({ error: 'Profile picture is required' });
        }
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Upload to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(profilePic, {
            folder: 'chatty/profile_pictures',
            allowed_formats: ['jpg', 'png', 'jpeg'],
            transformation: [{ width: 500, height: 500, crop: 'fill' }]
        });
        
        // Update user profile picture
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            {
                profilePicture: cloudinaryResponse.secure_url
            }, 
            { 
                new: true,
                select: '-password' // Exclude password from response
            }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Return success response
        return res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
        
    } catch (error:any) {
        console.error('Error during profile update:', error);
        
        // Handle specific Cloudinary errors
        if (error.name === 'CloudinaryError') {
            return res.status(400).json({ 
                error: 'Invalid image format or upload failed' 
            });
        }
        
        return res.status(500).json({ 
            error: 'An error occurred while updating the profile' 
        });
    }
}
export const checkAuth = (req:Request, res:Response) => {
  try {
    res.status(200).json(req.user);
  } catch (error:any) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};