const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/meetings', require('./routes/meeting'));

// Socket.io event handlers for video calling
const userSockets = new Map(); // userId -> socketId

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Register user for notifications
    socket.on('register-user', (userId) => {
        userSockets.set(userId, socket.id);
        console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    // Send notification to a specific user
    socket.on('send-notification', ({ investorId, meetingData }) => {
        const investorSocketId = userSockets.get(investorId);
        if (investorSocketId) {
            io.to(investorSocketId).emit('new-meeting-request', meetingData);
            console.log(`Notification sent to investor ${investorId}`);
        } else {
            console.log(`Investor ${investorId} not connected`);
        }
    });

    // When a user joins a meeting room
    socket.on('join-room', (meetingId, userId) => {
        socket.join(meetingId);
        console.log(`User ${userId} joined room ${meetingId}`);

        // Notify others in the room
        socket.to(meetingId).emit('user-connected', userId);

        // Handle user disconnect
        socket.on('disconnect', () => {
            socket.to(meetingId).emit('user-disconnected', userId);

            // Remove from userSockets map if it matches
            for (const [uid, sid] of userSockets.entries()) {
                if (sid === socket.id) {
                    userSockets.delete(uid);
                    break;
                }
            }

            console.log(`User ${userId} disconnected from room ${meetingId}`);
        });
    });

    // General disconnect (if not in a room)
    socket.on('disconnect', () => {
        // Remove from userSockets map
        for (const [uid, sid] of userSockets.entries()) {
            if (sid === socket.id) {
                userSockets.delete(uid);
                break;
            }
        }
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
