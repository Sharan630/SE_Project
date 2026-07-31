import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Report from "@/models/report";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectdb();
        const { reportedUser, reason, description, email } = await req.json();

        if (!reportedUser || !reason) {
            return NextResponse.json({ message: "Reported user and reason are required" }, { status: 400 });
        }

        const newReport = await Report.create({
            reporter: session.user.id, // Logged-in user reporting
            reportedUser,
            reason,
            description,
        });

        return NextResponse.json({ message: "Report submitted successfully", report: newReport }, { status: 201 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}


export async function GET() {
    try {
        await connectdb();

        const reports = await Report.find();

        return NextResponse.json(reports, { success: true }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
