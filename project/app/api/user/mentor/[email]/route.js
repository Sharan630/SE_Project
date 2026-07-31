import connectDB from "@/database/connectdb";
import { NextResponse } from "next/server";
import Notification from "@/models/notification";
import User from "@/models/user";

export async function GET(req, { params }) {
    try {

        const { email } = await params;
        console.log(email);

        if (!email) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        await connectDB();

        const mentor = await User.findOne({ email: email });

        const id = mentor._id;

        const Notifications = await Notification.find({ to: id });
        // console.log("data  : ")
        // console.log(Notification);
        // console.log(Notifications);
        const data = Notifications.map((Notification) => {
            return {
                _id: Notification._id,
                to: Notification.to,
                message: Notification.message,
                from: Notification.from
            }
        })
        // console.log(data);

        return NextResponse.json(data, {
            message: "Profile updated successfully",
        }, { status: 200 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}