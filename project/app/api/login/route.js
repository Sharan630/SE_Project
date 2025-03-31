import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { io } from "socket.io-client";


export async function POST(req) {
    try {

        await connectDB();

        const { email, pass } = await req.json();
        console.log(email, pass);
        if (!email || !pass) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: "Wrong email" }, { status: 404 });
        }

        const compare = bcrypt.compare(pass, user.password);

        if (compare) {
            const socket = io('http://localhost:3001');
            socket.emit('registerUser', email);

            return NextResponse.json({ message: "Correct parameters" }, { status: 200 });
        }

        return NextResponse.json({ message: "Wrong password" }, { status: 205 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}