import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { email } = await params;
        if (!email) {
            return NextResponse.json({ message: "Provide parameters" }, { status: 400 });
        }

        const decodedParam = decodeURIComponent(email).trim();
        
        let user;
        if (mongoose.Types.ObjectId.isValid(decodedParam)) {
            user = await User.findOne({
                $or: [
                    { _id: decodedParam },
                    { email: decodedParam }
                ]
            });
        } else {
            user = await User.findOne({ email: decodedParam });
        }

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}