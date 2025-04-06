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

        const { email, message, name, mentor } = await req.json();
        // console.log(email, message, name, mentor);

        if (!email || !name || !message) {
            return NextResponse.json({ message: "User ID and message are required" }, { status: 400 });
        }

        const to = await User.findOne({ phone: mentor });
        const from = await User.findOne({email: email});

        const newNotification = new Notification({
            to: to._id,
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

// import connectdb from "@/database/connectdb";
// import { NextResponse } from "next/server";
// import Notification from "@/models/notification";
// import User from "@/models/user";

// // GET notifications for a user by email
// export async function GET(req) {
//     try {
//         await connectdb();

//         const { searchParams } = new URL(req.url);
//         const email = searchParams.get("email");

//         if (!email) {
//             return NextResponse.json({ message: "email is required" }, { status: 400 });
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json({ message: "User not found" }, { status: 404 });
//         }

//         const notifications = await Notification.find({ to: user._id });

//         return NextResponse.json(notifications, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ message: err.message }, { status: 500 });
//     }
// }

// // POST a new notification
// export async function POST(req) {
//     try {
//         await connectdb();

//         const { email, message, name, mentor } = await req.json();

//         if (!email || !name || !message || !mentor) {
//             return NextResponse.json({ message: "All fields are required" }, { status: 400 });
//         }

//         const to = await User.findOne({ phone: mentor });
//         const from = await User.findOne({ email });

//         if (!to || !from) {
//             return NextResponse.json({ message: "Invalid sender or receiver" }, { status: 404 });
//         }

//         const newNotification = new Notification({
//             to: to._id,
//             from: from._id,
//             message
//         });

//         await newNotification.save();

//         return NextResponse.json({ message: "Notification created", notification: newNotification }, { status: 201 });
//     } catch (err) {
//         return NextResponse.json({ message: err.message }, { status: 500 });
//     }
// }

// // DELETE notification by ID (must be called as DELETE /api/notification?id=xyz)
// export async function DELETE(req) {
//     try {
//         await connectdb();

//         const { searchParams } = new URL(req.url);
//         const id = searchParams.get("id");

//         if (!id) {
//             return NextResponse.json({ message: "Notification ID is required" }, { status: 400 });
//         }

//         const deletedNotification = await Notification.findByIdAndDelete(id);

//         if (!deletedNotification) {
//             return NextResponse.json({ message: "Notification not found" }, { status: 404 });
//         }

//         return NextResponse.json({ message: "Notification deleted successfully" }, { status: 200 });
//     } catch (err) {
//         return NextResponse.json({ message: err.message }, { status: 500 });
//     }
// }
