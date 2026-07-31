import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectdb();

        const body = await req.json();
        console.log("[UPDATE MENTEE API] Received payload:", JSON.stringify(body, null, 2));

        const { name, skills, picture, bio, phone, email, linkedin } = body;

        if (!email || !name) {
            console.error("[UPDATE MENTEE API] Missing required fields (email/name):", { email, name });
            return NextResponse.json({ message: "Email and Name are required" }, { status: 400 });
        }

        const cleanEmail = email.trim();
        const mentee = await User.findOne({ email: cleanEmail });

        if (!mentee) {
            console.error("[UPDATE MENTEE API] Mentee not found for email:", cleanEmail);
            return NextResponse.json({ message: `Mentee not found for email: ${cleanEmail}` }, { status: 404 });
        }

        if (name !== undefined) mentee.name = name;
        if (skills !== undefined) mentee.skills = skills;
        if (picture !== undefined) mentee.picture = picture;
        if (bio !== undefined) mentee.bio = bio;
        if (phone !== undefined) mentee.phone = phone;
        if (linkedin !== undefined) mentee.linkedin = linkedin;

        await mentee.save();
        console.log("[UPDATE MENTEE API] Mentee updated successfully:", mentee._id);

        return NextResponse.json({
            message: "Profile updated successfully",
            mentee
        }, { status: 200 });

    } catch (err) {
        console.error("[UPDATE MENTEE API Error]:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
