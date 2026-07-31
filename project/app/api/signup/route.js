import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";
import BlockedUser from "@/models/blockeduser";


export async function POST(req) {
    try {

        await connectdb();

        const { email, pass, role } = await req.json();
        if (!email || !pass || !role) {
            return NextResponse.json({ message: "Email, password, and role are required" }, { status: 400 });
        }

        if (role.toLowerCase() === 'admin') {
            return NextResponse.json({ message: "Admin accounts cannot be created via public signup" }, { status: 400 });
        }

        const user2 = await BlockedUser.findOne({ email: email });
        if (user2) {
            return NextResponse.json({ message: "Blocked email detected" }, { status: 403 });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const existuser = await User.findOne({ email: email });

        if (existuser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        const user = new User({
            email: email,
            password: hashedPassword,
            role: role.toLowerCase()
        });

        await user.save();

        return NextResponse.json({ message: "Signed up successfully" }, { status: 201 });


    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}