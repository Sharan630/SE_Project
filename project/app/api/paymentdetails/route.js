import { NextResponse } from "next/server";
import connectDB from "@/database/connectdb";
import Review from "@/models/review";
import User from "@/models/user";
import Subscription from "@/models/subscription";

export async function GET(req) {
    try {
        await connectDB();
        const details = await Subscription.find({}).populate('mentor user');

        return NextResponse.json(details, { status: 200 });

    } catch (err) {
        console.error("Error fetching pending reviews:", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
