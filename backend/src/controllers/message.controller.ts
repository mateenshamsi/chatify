import { Request, Response } from "express";
import  User  from "../models/user.model";    
import  Message  from "../models/message.model";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebar = async (req:Request, res:Response) => { 
  try {
    const loggedInUser = req.user?._id
    const filteredUsers = await User.find({
        _id:{ $ne: loggedInUser },
    })
    res.status(200).json(filteredUsers);
}
catch(err)
{ 
    console.error('Error fetching users for sidebar:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const getMessages = async (req:Request, res:Response) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user?._id;

    if (!userId || !loggedInUser) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser, receiverId: userId },
        { senderId: userId, receiverId: loggedInUser }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export const sendMessage = async (req:Request, res:Response) => {
  try {
    const { userId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user?._id;

    if (!userId || !senderId) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    let imageUrl = null;
    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: 'chatify/messages',
      });
      imageUrl = uploadResult.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId: userId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

