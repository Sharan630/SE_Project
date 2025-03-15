const { Server } = require("socket.io");
const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', "POST"]
    },
});

io.on("connection", (socket) => {
    console.log(`connected: ${socket.id}`);

    socket.on("sendMessage", (data) => {
        console.log(`Received message: ${data.text}`);
        // const {transferTo} = data;
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(3001, () => {
    console.log("✅ Socket.IO Server running on port 3001");
});
