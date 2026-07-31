import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Subscription from "@/models/subscription";
import User from "@/models/user";
import Notification from "@/models/notification";

export async function POST(req) {
    try {
        await connectdb();

        const { notif_id, plan, price, paymentId, email } = await req.json();
        // console.log(notif_id, plan, price, paymentId, email);

        if (!notif_id || !plan || price === "undefined" || !email) {
            return NextResponse.json({ message: "Parameters are required" }, { status: 400 });
        }

        // Step 1: Get mentee ID from notification
        const notif = await Notification.findOne({ _id: notif_id });
        const menteeId = notif.from;

        // Step 2: Get mentor by email
        const mentor = await User.findOne({ email });
        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        // Step 3: Save subscription
        const new_sub = new Subscription({
            user: menteeId,
            plan,
            price,
            paymentId,
            mentor: mentor._id
        });

        await new_sub.save();

        // Step 4: Calculate endDate
        const today = new Date();
        const endDate = new Date(today);
        if (plan === "free") {
            endDate.setDate(endDate.getDate() + 1);
        } else if (plan === "monthly") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 });
        }

        // Step 5: Add mentee to mentor's connections
        await User.updateOne(
            { _id: mentor._id },
            {
                $addToSet: {
                    connected: {
                        user: menteeId,
                        endDate: endDate
                    }
                }
            }
        );

        // Step 6: Add mentor to mentee's connections
        await User.updateOne(
            { _id: menteeId },
            {
                $addToSet: {
                    connected: {
                        user: mentor._id,
                        endDate: endDate
                    }
                }
            }
        );

        return NextResponse.json({ message: "Subscription and mutual connection added successfully." }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
