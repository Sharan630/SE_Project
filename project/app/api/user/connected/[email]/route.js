import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(req, { params }) {
    try {

        const { email } = await params;
        // console.log(email);

        if (!email) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        await connectdb();

        const users = await User.findOne({ email: email }).populate('connected');
        // console.log(users.connected);
        const data = users.connected.map((user) => {
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                picture: user.picture
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