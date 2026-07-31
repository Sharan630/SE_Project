// Fixed capture-payment API route
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import payment from "@/models/payment";
import connectdb from "@/database/connectdb";
import User from "@/models/user";
import Subscription from "@/models/subscription";

export async function POST(req) {
    let order_id = null;
    let payment_id = null;

    try {
        await connectdb();
        const {
            order_id: receivedOrderId,
            payment_id: receivedPaymentId,
            mentorId: mentorId,
            menteeId: menteeId
        } = await req.json();

        order_id = receivedOrderId;
        payment_id = receivedPaymentId;

        if (!payment_id || !order_id || !mentorId || !menteeId) {
            return NextResponse.json({ error: "Invalid payment_id or order_id" }, { status: 400 });
        }

        const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
        const mentee = await User.findOne({ _id: menteeId, role: "mentee" });

        if (!mentor || !mentee) {
            return NextResponse.json({ message: "Mentor or mentee not found" }, { status: 404 });
        }

        // Check if payment already exists
        const existingPayment = await Subscription.findOne({ paymentId: payment_id });
        const plan = "monthly";

        // Calculate endDate
        const today = new Date();
        const endDate = new Date(today);
        if (plan === "monthly") {
            endDate.setMonth(endDate.getMonth() + 1);
        } else {
            return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 });
        }

        if (existingPayment) {
            // Update existing subscription
            await Subscription.updateOne(
                { paymentId: payment_id },
                { $set: { endDate: endDate } }
            );

            // Update mentor's connection endDate
            await User.updateOne(
                {
                    _id: mentor._id,
                    "connected.user": menteeId
                },
                {
                    $set: {
                        "connected.$.endDate": endDate
                    }
                }
            );

            // Update mentee's connection endDate
            await User.updateOne(
                {
                    _id: menteeId,
                    "connected.user": mentor._id
                },
                {
                    $set: {
                        "connected.$.endDate": endDate
                    }
                }
            );

            return NextResponse.json({
                message: "Subscription and connections updated successfully",
                redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`
            }, { status: 200 });
        } else {
            // Create new subscription
            const new_sub = new Subscription({
                user: menteeId,
                plan: plan,
                price: mentor.fees,
                paymentId: payment_id,
                mentor: mentor._id,
                endDate: endDate
            });

            await new_sub.save();

            // Add mentee to mentor's connections
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

            // Add mentor to mentee's connections
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

            return NextResponse.json({
                message: "Mentee and Mentor connected successfully",
                redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`
            }, { status: 200 });
        }

    } catch (error) {
        console.error("Error capturing payment:", error);

        // Handle already captured scenario
        if (error.error && error.error.code === "BAD_REQUEST_ERROR" &&
            error.error.description === "This payment has already been captured") {
            return NextResponse.json({
                success: true,
                redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`
            });
        }

        return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
    }
}