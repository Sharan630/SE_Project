import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function POST(req) {
    try {

        await connectdb();

        const { email, name, skills, imageLink, bio, phone } = await req.json();
        console.log(email, name, skills, bio, phone);
        if (!email || !name || !phone) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const mentee = await User.findOne({ email, role: "mentee" });
        if (!mentee) {
            return NextResponse.json({ message: "Mentee not found" }, { status: 404 });
        }

        if (name) mentee.name = name;
        if (skills) mentee.skills = skills;
        if (imageLink) mentee.picture = imageLink;
        if (bio) mentee.bio = bio;
        if (phone) mentee.phone = phone;

        await mentee.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            mentee
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}