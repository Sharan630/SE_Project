import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function GET(req, { params }) {
    try {

        const { id } = await params;
        console.log(id);
        if (!id) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }
        await connectDB();
        const users = await User.findOne({ _id: id });
        // console.log(users);

        return NextResponse.json(users, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}