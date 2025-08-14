// server/models/conversation.model.js

import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],

  
    lastMessage: {
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
      },
     
      createdAt: {
        type: Date,
      },
    },
  },

  { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
