import connectDB from "@/database/connectdb";
import Message from "@/models/message";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {

        await connectDB();
        const messages = await Message.find().sort({ timestamp: -1 }).limit(10);
        return NextResponse.json(messages, { status: 200 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}

export async function POST(req, res) {
    try {
        const { text, sender, receiver } = await req.json();
        const newMessage = new Message({
            text,
            sender,
            receiver
        });
        await newMessage.save();
        return Response.json(newMessage, { status: 201 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}
