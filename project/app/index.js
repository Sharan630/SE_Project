import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/message.js";
import User from "../models/user.js";
import connectDB from "../database/connectdb.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

connectDB();

io.on("connection", async (socket) => {
    console.log(`User connected: ${socket.id}`);
    // Handle joining a specific chat room
    socket.on("joinRoom", ({ user_id, roomId }) => {
        if (!roomId) return;

        // Actually join the room (previously was joining user_id instead)
        socket.join(roomId);
        console.log(`User ${user_id} joined room ${roomId}`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data) => {
        const { content, to, from, roomId } = data;

        if (!roomId) {
            console.error("No roomId provided");
            return;
        }

        // Save message to database
        const message = new Message({
            sender: from,
            receiver: to,
            content: content,
            room: roomId
        });
        await message.save();

        // Send to SPECIFIC room only
        io.to(roomId).emit("receiveMessage", {
            content,
            from,
            to,
            timestamp: new Date(),
            // _id: message._id  // include DB ID
        });

        console.log(`Message sent to room ${roomId}: ${content}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        // await User.findOneAndUpdate({ socketId: socket.id }, { socketId: null });
    });
});

server.listen(3002, () => {
    console.log("✅ Socket.IO Server running on port 3001");
});