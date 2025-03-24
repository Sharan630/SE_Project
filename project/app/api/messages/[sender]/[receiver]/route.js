import connectDB from "@/database/connectdb";
import Message from "@/models/message";
import { NextResponse } from "next/server";


export async function GET(req, { params }) {
    try {
        const { sender, receiver } = await params;
        // console.log(sender, receiver);

        await connectDB();
        const messages = await Message.find({ receiver: receiver, sender: sender });
        const msg2 = await Message.find({ receiver: sender, sender: receiver });
        // console.log(messages);
        const data = messages.map((msg) => {
            return {
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
            }
        })

        const data2 = msg2.map((msg) => {
            return {
                content: msg.content,
                sender: msg.sender,
                receiver: msg.receiver,
            }
        })

        const combined_data = [
            ...data,
            ...data2,
        ]
        console.log(combined_data);
        // console.log(data);
        return NextResponse.json(combined_data, { status: 200 });

    } catch (e) {
        return NextResponse.json({ err: e.message }, { status: 500 });
    }
}