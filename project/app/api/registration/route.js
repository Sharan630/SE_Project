import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";


export async function POST(req) {
    try {

        await connectdb();

        const { email, role, name,  } = await req.json();
        if (!email || !role) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(pass);

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