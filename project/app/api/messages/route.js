let messages = [];

export async function GET(req) {
    return Response.json({ messages });
}

export async function POST(req, res) {
    const { text, sender } = await req.json();
    const newMessage = { text, sender, timestamp: new Date() };
    // messages.push(newMessage);
    // console.log(newMessage);

    // Get the Socket.IO instance from global scope
    if (res.socket?.server?.io) {
        res.socket.server.io.emit("sendMessage", newMessage);
    } else {
        console.error("❌ Socket.IO instance not found");
    }

    return Response.json(newMessage, { status: 201 });
}
