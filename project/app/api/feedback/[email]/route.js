import { NextResponse } from "next/server";
import connectDB from "@/database/connectdb";
import Review from "@/models/review";
import User from "@/models/user";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { email } = await params;

        const menteeEmail = email;
        // console.log(menteeEmail);

        // Find user by email
        const mentee = await User.findOne({ email: menteeEmail, role: "mentee" });
        if (!mentee) {
            return NextResponse.json({ message: "Mentee not found" }, { status: 404 });
        }

        // Find all pending reviews for this mentee
        const pendingReviews = await Review.findOne({ mentee: mentee._id, done: false }).populate("mentor");
        // console.log(pendingReviews);

        return NextResponse.json({ reviews: pendingReviews }, { status: 200 });

    } catch (err) {
        console.error("Error fetching pending reviews:", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
