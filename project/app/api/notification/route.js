import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";
import User from "@/models/user";

export async function GET(req, { params }) {
    try {
        await connectdb();

        // Extract userId from query params
        const { email } = await params;

        if (!email) {
            return NextResponse.json({ message: "email is required" }, { status: 400 });
        }

        const user = await User.findOne({ email: email });

        const notifications = await Notification.find({ to: user._id });

        return NextResponse.json(notifications, { message: "successful" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectdb();

        const { email, message, to } = await req.json();

        if (!email || !to || !message) {
            return NextResponse.json({ message: "User ID and message are required" }, { status: 400 });
        }

        const from = await User.findOne({ email: email });

        const newNotification = new Notification({
            to: to,
            message: message,
            from: from._id
        });

        await newNotification.save();

        return NextResponse.json({ message: "Notification created successfully", notification: newNotification }, { status: 201 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectdb();

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ message: "Notification ID is required" }, { status: 400 });
        }

        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return NextResponse.json({ message: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}