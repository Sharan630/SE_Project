import { Server } from "socket.io";
import express from "express";
import http from "http";
import Message from "../models/message.js";
import connectDB from "../database/connectdb.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

connectDB().then(() => {
    console.log("✅ MongoDB connected for Socket server");
}).catch(err => console.error("MongoDB connection error:", err));

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("joinRoom", ({ user_id, roomId }) => {
        console.log("Join room request received with data:", { user_id, roomId });

        if (!roomId) {
            console.error("No roomId provided in joinRoom event");
            return;
        }

        if (!user_id) {
            console.error("No user_id provided in joinRoom event");
            return;
        }

        socket.join(roomId);
        console.log(`User ${user_id} joined room ${roomId}`);

        socket.emit("roomJoined", { roomId, status: "success" });
    });

    socket.on("sendMessage", async (data) => {
        const { content, to, from, roomId, fileUrl, fileName, fileType } = data;

        if (!roomId) {
            console.error("No roomId provided");
            return;
        }

        try {
            if (from && to) {
                const message = new Message({
                    sender: from,
                    receiver: to,
                    content: content,
                    room: roomId,
                    fileUrl,
                    fileName,
                    fileType
                });
                await message.save();
            }

            io.to(roomId).emit("receiveMessage", {
                content,
                from,
                to,
                timestamp: new Date(),
                fileUrl,
                fileName,
                fileType
            });

            console.log(`Message sent to room ${roomId}: ${content}`);
        } catch (error) {
            console.error("Failed to save message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log("✅ Socket.IO Server running on port 3001");
});