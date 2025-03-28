import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Review from "@/models/review";
import User from "@/models/user";
import connectDB from "@/utils/connectDB";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { mentor, mentee, rating, comment } = body;

        if (!mentor || !mentee || !rating) {
            return NextResponse.json({ message: "Mentor, mentee, and rating are required." }, { status: 400 });
        }

        const newReview = new Review({ mentor, mentee, rating, comment });
        await newReview.save();

        const mentorUser = await User.findById(mentor);
        if (!mentorUser) {
            return NextResponse.json({ message: "Mentor not found." }, { status: 404 });
        }

        mentorUser.ratings.reviews.push({ userId: mentee, rating, comment });

        const totalRatings = mentorUser.ratings.reviews.length;
        const sumRatings = mentorUser.ratings.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        mentorUser.ratings.average = totalRatings > 0 ? sumRatings / totalRatings : 0;

        await mentorUser.save();

        return NextResponse.json({ message: "Review added and mentor rating updated.", review: newReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
