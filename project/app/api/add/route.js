import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import Notification from "@/models/notification";

export async function POST(req) {
    try {
        await connectdb();

        const { mentorEmail, menteeEmail } = await req.json();

        if (!mentorEmail || !menteeEmail) {
            return NextResponse.json({ message: "Mentor and mentee email are required" }, { status: 400 });
        }

        const mentor = await User.findOne({ email: mentorEmail, role: "mentor" });
        const mentee = await User.findOne({ email: menteeEmail, role: "mentee" });

        if (!mentor || !mentee) {
            return NextResponse.json({ message: "Mentor or mentee or notification not found" }, { status: 404 });
        }

        if (mentor.connectedWith.includes(mentee._id) && mentee.connectedWith.includes(mentor._id)) {
            return NextResponse.json({ message: "Already connected" }, { status: 400 });
        }

        mentor.connectedWith.push(mentee._id);
        mentee.connectedWith.push(mentor._id);

        await mentor.save();
        await mentee.save();

        return NextResponse.json(mentor, mentee, {
            message: "Mentee request accepted successfully",
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
