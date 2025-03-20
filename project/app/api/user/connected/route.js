import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req, { params }) {
    try {

        const { email } = await params;

        if (!email) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        await connectdb();

        const users = await User.findOne({ email: email }).populate('connected');

        return NextResponse.json(users, {
            message: "Profile updated successfully",
        }, { status: 200 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}