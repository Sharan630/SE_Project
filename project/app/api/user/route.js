import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function GET(req) {
    try {

        await connectDB();
        const users = await User.find({ role: 'mentor' });

        return NextResponse.json(users, { status: 200 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}