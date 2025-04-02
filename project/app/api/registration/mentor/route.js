import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function POST(req) {
    try {
        await connectDB();

        const { email, name, skills, picture, experience, availability, bio, phone, fees } = await req.json();
        // console.log(email, name, skills, picture, experience, availability, bio, phone);
        if (!email || !name || !skills || !experience || !bio || !availability || !phone || !fees) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const mentor = await User.findOne({ email, role: "mentor" });
        // console.log(mentor);
        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        if (name) mentor.name = name;

        if (skills) mentor.skills = skills;

        if (picture !== "") mentor.picture = picture;

        if (experience) mentor.experience = experience;

        if (availability) mentor.availability = availability;

        if (bio) mentor.bio = bio;

        if (phone) mentor.phone = phone;
        if (fees) mentor.fees = fees;


        await mentor.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            mentor
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}