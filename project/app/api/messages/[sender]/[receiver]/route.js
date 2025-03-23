import connectDB from "@/database/connectdb";
import Message from "@/models/message";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        const { sender, receiver } = await params;
        // console.log(sender, receiver);

        await connectDB();
        const messages = await Message.find({ receiver: receiver, sender: sender });
        // console.log(messages);
        const data = messages.map((msg) => {
            return {
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
            }
        })
        // console.log(data);
        return NextResponse.json(data, { status: 200 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}