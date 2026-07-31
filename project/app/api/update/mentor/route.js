import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectdb();

        const body = await req.json();
        console.log("[UPDATE MENTOR API] Received payload:", JSON.stringify(body, null, 2));

        const { email, name, skills, fees, picture, experience, availability, bio, phone, linkedin } = body;

        if (!email || !name) {
            console.error("[UPDATE MENTOR API] Missing required fields (email/name):", { email, name });
            return NextResponse.json({ message: "Email and Name are required parameters" }, { status: 400 });
        }

        const cleanEmail = email.trim();
        const mentor = await User.findOne({ email: cleanEmail });

        if (!mentor) {
            console.error("[UPDATE MENTOR API] Mentor not found for email:", cleanEmail);
            return NextResponse.json({ message: `Mentor not found for email: ${cleanEmail}` }, { status: 404 });
        }

        if (name !== undefined) mentor.name = name;
        if (skills !== undefined) mentor.skills = skills;
        if (picture !== undefined) mentor.picture = picture;
        if (experience !== undefined) mentor.experience = experience;
        if (availability !== undefined) mentor.availability = availability;
        if (bio !== undefined) mentor.bio = bio;
        if (phone !== undefined) mentor.phone = phone;
        if (fees !== undefined) mentor.fees = fees;
        if (linkedin !== undefined) mentor.linkedin = linkedin;

        await mentor.save();
        console.log("[UPDATE MENTOR API] Mentor updated successfully:", mentor._id);

        return NextResponse.json({
            message: "Profile updated successfully",
            mentor
        }, { status: 200 });

    } catch (err) {
        console.error("[UPDATE MENTOR API Error]:", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}