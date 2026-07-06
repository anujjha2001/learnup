const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3001;

// Track viewers per room
const roomViewers = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join Live Session Room
  socket.on('join-room', (roomId, user) => {
    socket.join(roomId);
    
    if (!roomViewers.has(roomId)) {
      roomViewers.set(roomId, new Set());
    }
    roomViewers.get(roomId).add(socket.id);
    
    // Broadcast updated viewer count
    io.to(roomId).emit('viewer-count', roomViewers.get(roomId).size);
    
    // Announce user joined
    if (user && user.name) {
      io.to(roomId).emit('chat-message', {
        id: Date.now().toString(),
        senderName: 'System',
        text: `${user.name} joined the live session.`,
        isSystem: true,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`[Socket] User ${socket.id} joined room ${roomId}. Total viewers: ${roomViewers.get(roomId).size}`);
  });

  // Handle Chat Message
  socket.on('send-message', (roomId, messageData) => {
    io.to(roomId).emit('chat-message', messageData);
  });

  // Handle disconnect
  socket.on('disconnecting', () => {
    for (const roomId of socket.rooms) {
      if (roomId !== socket.id && roomViewers.has(roomId)) {
        roomViewers.get(roomId).delete(socket.id);
        io.to(roomId).emit('viewer-count', roomViewers.get(roomId).size);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Live Session Socket.io Server running on port ${PORT}`);
});
