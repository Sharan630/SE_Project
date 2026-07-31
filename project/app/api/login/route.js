import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { io } from "socket.io-client";
import BlockedUser from "@/models/blockeduser";


export async function POST(req) {
    try {

        await connectDB();

        const { email, pass } = await req.json();
        console.log(email, pass);
        if (!email || !pass) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
        }

        const user2 = await BlockedUser.findOne({ email: email });
        if (user2) {
            return NextResponse.json({ message: "Blocked email detected" }, { status: 403 });
        }

        const isMatch = await bcrypt.compare(pass, user.password);

        if (isMatch) {
            // const socket = io('http://localhost:3001');
            // socket.emit('registerUser', email);

            return NextResponse.json({ message: "Login successful", user: { id: user._id, email: user.email, role: user.role } }, { status: 200 });
        }

        return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });


    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}