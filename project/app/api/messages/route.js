import connectDB from "@/database/connectdb";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const { sender, receiver } = await params;
        console.log(sender, receiver);

        await connectDB();
        const messages = await Message.findOne({ receiver: receiver, sender: sender }).sort({ timestamp: -1 }).limit(10);
        console.log(messages);
        return NextResponse.json(messages, { status: 200 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}

export async function POST(req, res) {
    try {
        const { content, sender, receiver } = await req.json();
        const newMessage = new Message({
            content,
            sender,
            receiver
        });
        await newMessage.save();
        return Response.json(newMessage, { status: 201 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}
