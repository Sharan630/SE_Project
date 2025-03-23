import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";


export async function POST(req) {
    try {

        await connectdb();

        const { email, pass, role } = await req.json();
        if (!email || !pass || !role) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const existuser = await User.findOne({ email: email });

        if (existuser) {
            return NextResponse.json({ message: "Email already exists" }, { status: 409 });
        }

        const user = new User({
            email: email,
            password: hashedPassword,
            role: role
        });

        await user.save();

        return NextResponse.json({ message: "Signed up successfully" }, { status: 200 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}