import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function POST(req) {
    try {
        await connectdb();

        const { email, name, skills, imageLink, experience, availability, bio, phone } = await req.json();
        if (!email || !name || !skills || !experience || !bio || !availability || !phone) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const mentor = await User.findOne({ email, role: "mentor" });
        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        if (name) mentor.name = name;
        if (skills) mentor.skills = skills;
        if (imageLink) mentor.picture = imageLink;
        if (experience !== undefined) mentor.experience = experience;
        if (availability) mentor.availability = availability;
        if (bio) mentor.bio = bio;
        if (phone) mentor.phone = phone;

        await mentor.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            mentor
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}