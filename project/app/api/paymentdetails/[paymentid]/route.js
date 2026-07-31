import { NextResponse } from "next/server";
import connectDB from "@/database/connectdb";
import Review from "@/models/review";
import User from "@/models/user";
import Subscription from "@/models/subscription";

export async function GET(req, { params }) {
    try {
        await connectDB();

        const { paymentid } = await params;

        console.log(paymentid);

        // console.log(menteeEmail);

        // Find user by email
        const details = await Subscription.findOne({ paymentId: paymentid });
        if (!details) {
            return NextResponse.json({ message: "details not found" }, { status: 404 });
        }

        // Find all pending reviews for this mentee
        // const pendingReviews = await Review.findOne({ mentee: mentee._id, done: false }).populate("mentor");
        // // console.log(pendingReviews);

        return NextResponse.json(details, { status: 200 });

    } catch (err) {
        console.error("Error fetching pending reviews:", err);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
