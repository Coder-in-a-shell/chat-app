import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const userSocketMap = {} // Store user socket IDs here

export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId]; // Retrieve the socket ID for the user
}

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173']
    },
});

io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
    const userId = socket.handshake.query.userId; // Assuming userId is passed in the query string
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the socket ID for the user
    }
    // emit for broadcasting to all clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Notify all clients about the new connection

    socket.on('disconnect', () => { 
        console.log('user disconnected', socket.id);
        delete userSocketMap[userId]; // Remove the socket ID from the map
        io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Notify all clients about the disconnection 
    });
});

export { io, app, server };