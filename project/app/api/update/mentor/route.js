import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";


export async function POST(req) {
    try {

        await connectdb();

        const { email, name, skills, fees, picture, experience, availability, bio, phone, linkedin } = await req.json();
        console.log(name, skills, picture, experience, availability, bio, phone, fees);
        if (!email || !name) {
            return NextResponse.json({ message: "Email and Name are required parameters" }, { status: 400 });
        }

        const mentor = await User.findOne({ email, role: "mentor" });
        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        if (name) mentor.name = name;
        if (skills) mentor.skills = skills;
        if (picture) mentor.picture = picture;
        if (experience) mentor.experience = experience;
        if (availability) mentor.availability = availability;
        if (bio) mentor.bio = bio;
        if (phone) mentor.phone = phone;
        if (fees) mentor.fees = fees;
        if (linkedin) mentor.linkedin = linkedin;

        await mentor.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            mentor
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}