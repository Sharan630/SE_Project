import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectdb();

        const body = await req.json();
        const { name, skills, picture, bio, phone, email, linkedin } = body;

        if (!email || !name) {
            return NextResponse.json({ message: "Email and Name are required" }, { status: 400 });
        }

        const mentee = await User.findOne({ email: email.trim() });
        if (!mentee) {
            return NextResponse.json({ message: "Mentee not found" }, { status: 404 });
        }

        if (name) mentee.name = name;
        if (skills) mentee.skills = skills;
        if (picture) mentee.picture = picture;
        if (bio) mentee.bio = bio;
        if (phone) mentee.phone = phone;
        if (linkedin) mentee.linkedin = linkedin;

        await mentee.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            mentee
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}