// server.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], 
    credentials: true,
  },
});

const userSocketMap: Record<string, string[]> = {};
// Keep track of socket to user mapping for disconnect handling
const socketToUserMap: Record<string, string> = {};

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);
  console.log('Handshake auth:', socket.handshake.auth);
  console.log('Handshake query:', socket.handshake.query);
  
  // Try to get userId from auth first (new way), then from query (old way)
  let userId: string | undefined;
  
  // Check auth object first (new frontend implementation)
  if (socket.handshake.auth && socket.handshake.auth.userId) {
    userId = socket.handshake.auth.userId;
  }
  // Fallback to query (old implementation)
  else if (socket.handshake.query.userId) {
    userId = Array.isArray(socket.handshake.query.userId)
      ? socket.handshake.query.userId[0]
      : socket.handshake.query.userId;
  }
  
  console.log('Extracted userId:', userId, 'Type:', typeof userId);
  
  // Validate userId before adding to userSocketMap
  if (userId && userId !== 'undefined' && typeof userId === 'string') {
    if (!userSocketMap[userId]) userSocketMap[userId] = [];
    userSocketMap[userId].push(socket.id);
    
    // Store the mapping for disconnect handling
    socketToUserMap[socket.id] = userId;
    
    console.log('User added to socket map:', userId, 'Current online users:', Object.keys(userSocketMap));
  } else {
    console.log('Invalid or missing userId for socket connection:', socket.id);
    console.log('Full handshake object:', JSON.stringify(socket.handshake, null, 2));
  }

  // Emit online users to all clients
  io.emit('getOnlineUsers', Object.keys(userSocketMap));
  console.log('Emitted online users:', Object.keys(userSocketMap));

  socket.on('privateMessage', ({ toUserId, message }: { toUserId: string; message: string }) => {
    const senderId = socketToUserMap[socket.id];
    if (!senderId) {
      console.log('Cannot send message: sender not found in socketToUserMap');
      return;
    }
    
    const targetSockets = userSocketMap[toUserId];
    if (targetSockets) {
      targetSockets.forEach((sockId) => {
        io.to(sockId).emit('privateMessage', {
          fromUserId: senderId,
          message,
        });
      });
    }
  });

  socket.on('logout', () => {
    console.log('User logout event received for socket:', socket.id);
    // Handle logout event if needed
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnecting:', socket.id);
    
    // Get the userId from our mapping
    const userId = socketToUserMap[socket.id];
    
    if (userId) {
      console.log('User disconnecting:', userId);
      
      // Remove socket from user's socket array
      if (userSocketMap[userId]) {
        userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
        
        // If user has no more sockets, remove them from online users
        if (userSocketMap[userId].length === 0) {
          delete userSocketMap[userId];
          console.log('User removed from online users:', userId);
        } else {
          console.log('User still has other connections:', userId, userSocketMap[userId]);
        }
      }
      
      // Clean up the socket to user mapping
      delete socketToUserMap[socket.id];
    } else {
      console.log('Disconnecting socket had no associated userId:', socket.id);
    }
    
    console.log('Current online users after disconnect:', Object.keys(userSocketMap));
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });
});
export  {io,server,app}
