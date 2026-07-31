// API route: /api/check-payment-eligibility
import { NextResponse } from "next/server";
import connectdb from "@/database/connectdb";
import Subscription from "@/models/subscription";
import User from "@/models/user";

export async function POST(req) {
    try {
        await connectdb();

        const { menteeId, mentorId } = await req.json();

        if (!menteeId || !mentorId) {
            return NextResponse.json(
                { error: "menteeId and mentorId are required" },
                { status: 400 }
            );
        }

        const mentee = await User.findById(menteeId);
        if (!mentee || mentee.role !== "mentee") {
            return NextResponse.json(
                { error: "Mentee not found" },
                { status: 404 }
            );
        }

        const mentor = await User.findById(mentorId);
        if (!mentor || mentor.role !== "mentor") {
            return NextResponse.json(
                { error: "Mentor not found" },
                { status: 404 }
            );
        }

        const existingSubscription = await Subscription.findOne({
            user: menteeId,
            mentor: mentorId,
        });

        console.log(existingSubscription)

        if (existingSubscription) {
            if (existingSubscription.plan === "free") {

                const today = existingSubscription.startDate;
                const endDate = new Date(today);
                const plan = existingSubscription.plan;
                if (plan === "free") {
                    endDate.setDate(endDate.getDate() + 1);
                } if (plan === "monthly") {
                    endDate.setMonth(endDate.getMonth() + 1);
                }

                if (endDate >= new Date()) {

                    return NextResponse.json(
                        {
                            canPay: true,
                            message: "Mentee can upgrade from free to paid subscription",
                            existingSubscription
                        },
                        { status: 200 }
                    );
                } else {
                    return NextResponse.json(
                        {
                            canPay: false,
                            message: "Mentee can not upgrade from free to paid subscription",
                            existingSubscription
                        },
                        { status: 200 }
                    );
                }
            } else {
                return NextResponse.json(
                    {
                        canPay: false,
                        message: "Mentee already has an active paid subscription with this mentor",
                        existingSubscription
                    },
                    { status: 200 }
                );
            }
        }

        return NextResponse.json(
            {
                canPay: false,
                message: "Send Request to mentor first"
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error checking payment eligibility:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}