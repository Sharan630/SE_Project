// import { Server } from "socket.io";

// export default function handler(req, res) {
//     if (!res.socket.server.io) {
//         console.log("⚡ Initializing Socket.IO Server...");
//         const io = new Server(res.socket.server, {
//             path: "/api/socket",
//             cors: {
//                 origin: "http://localhost:3000", // Ensure frontend can connect
//                 methods: ["GET", "POST"],
//             },
//         });

//         io.on("connection", (socket) => {
//             console.log(`✅ New connection: ${socket.id}`);

//             socket.on("sendMessage", (msg) => {
//                 io.emit("receiveMessage", msg); // Broadcast message to all clients
//             });

//             socket.on("disconnect", () => {
//                 console.log(`❌ Disconnected: ${socket.id}`);
//             });
//         });

//         res.socket.server.io = io; // Attach to server
//     }

//     res.end();
// }
