import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";

export async function DELETE(req, { params }) {
    try {
        await connectdb();

        const { id } = await params;
        console.log(id);

        if (!id) {
            return NextResponse.json({ message: "Notification ID is required" }, { status: 400 });
        }

        const deletedNotification = await Notification.findByIdAndDelete(id);

        if (!deletedNotification) {
            return NextResponse.json({ message: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
