let messages = [];

export default function handler(req, res) {
    if (req.method === "GET") {
        return res.status(200).json({ messages });
    }

    if (req.method === "POST") {
        const { text, sender } = req.body;
        const newMessage = { text, sender, timestamp: new Date() };
        messages.push(newMessage);

        if (res.socket?.server?.io) {
            res.socket.server.io.emit("receiveMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    }

    res.status(405).json({ error: "Method not allowed" });
}
