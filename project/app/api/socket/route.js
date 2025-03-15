let messages = [];

export async function GET(req) {
    return Response.json({ messages });
}

export async function POST(req) {
    const { text, sender } = await req.json();
    const newMessage = { text, sender, timestamp: new Date() };
    messages.push(newMessage);

    if (global.io) {
        global.io.emit("receiveMessage", newMessage);
    }

    return Response.json(newMessage, { status: 201 });
}
