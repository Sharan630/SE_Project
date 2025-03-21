const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

const users = {};

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("registerUser", (userId) => {
        users[userId] = socket.id;
        console.log(`User registered: ${userId} -> ${socket.id}`);
    });

    socket.on("sendMessage", (data) => {
        const { text, to } = data;
        const recipientSocketId = users[to];

        if (recipientSocketId) {
            io.to(recipientSocketId).emit("receiveMessage", {
                text,
                from: socket.id,
            });
            console.log(`Message sent to ${to} (${recipientSocketId}): ${text}`);
        } else {
            console.log(`User ${to} not found`);
        }
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        for (const userId in users) {
            if (users[userId] === socket.id) {
                delete users[userId];
                break;
            }
        }
    });
});

server.listen(3001, () => {
    console.log("✅ Socket.IO Server running on port 3001");
});
