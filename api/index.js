import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import http from 'http';
import { Server as socketio } from 'socket.io';
import cors from 'cors';
import { formatMessage } from './utils/messages.js';
import { userJoin, getCurrentUser, userLeave, getRoomUsers, resetUsers } from './utils/users.js';

dotenv.config();

mongoose.connect(
    "mongodb+srv://raghav12115dspscrowdfunding:raghav12115dspscrowdfunding@cluster0.knzx1bi.mongodb.net/rental?retryWrites=true&w=majority"
)
.then(() => {
    console.log("Connected to MongoDB!");
})
.catch((err) => {
    console.log(err);
});

const __dirname = path.resolve();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

const server = http.createServer(app);
const io = new socketio(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('New WS Connection');

    resetUsers();
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // Welcome current user
        socket.emit('message', formatMessage('ChatBot', 'Welcome to Community'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage('ChatBot', `${user.username} has joined the chat`));
    
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage('ChatBot', `${user.username} has left the chat`));
        
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
