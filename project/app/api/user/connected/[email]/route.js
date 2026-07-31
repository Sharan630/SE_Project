import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import Subscription from "@/models/subscription";
import Review from "@/models/review";

export async function GET(req, { params }) {
    try {
        const { email } = await params;

        if (!email) {
            return NextResponse.json({ message: "Provide mentor email" }, { status: 400 });
        }

        await connectdb();

        const mentor = await User.findOne({ email });
        const mentor_id = mentor._id;

        const today = new Date();

        const currentUser = await User.findOne({ email: email }).populate({
            path: "connected.user",
            select: "_id name email picture phone role"
        });

        // console.log("Current User:", currentUser);

        if (!currentUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const validConnections = currentUser.connected.filter((conn) => {
            return conn.endDate && new Date(conn.endDate) > today;
        });

        // console.log(validConnections)

        const checkAndCreateReviews = async () => {
            // console.log("function called");
            for (const conn of currentUser.connected) {
                if (!conn.endDate || new Date(conn.endDate) <= today) {
                    // console.log("review added");
                    const existingReview = await Review.findOne({ mentor: mentor_id, mentee: conn.user._id });
                    if (!existingReview) {
                        const newReview = new Review({
                            mentor: mentor_id,
                            mentee: conn.user._id,
                            done: false
                        });
                        await newReview.save();
                    }
                }
            }
        };

        await checkAndCreateReviews();

        console.log(validConnections)

        return NextResponse.json(validConnections, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
