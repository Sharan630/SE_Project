"use client";
import { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import axios from "axios";

export default function Chat() {
    const [message, setMessage] = useState("");
    var socket = useMemo(() => io("http://localhost:3001"));
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        axios.get("/api/messages")
            .then((res) => setMessages(res.data.messages))
            .catch((err) => console.error(err));

        socket.on("receiveMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const newMessage = { text: message, sender: "User" };

        try {
            // await axios.post("/api/messages", newMessage);
            socket.emit("sendMessage", newMessage);
            setMessage("");
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <div>
            <h2>Real-Time Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}: </strong> {msg.text}
                    </p>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
