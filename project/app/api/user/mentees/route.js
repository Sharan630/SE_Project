import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function GET() {
    try {
        await connectdb();
        const mentees = await User.find({ role: 'mentee' }).select('_id name email');
        return NextResponse.json(mentees);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}