import db from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";


export async function GET(req, { params }) {
    try {

        await db.connect();
        const { email } = await params;
        if (!email) {
            return NextResponse.json({ message: "Provide poaameters" }, { status: 404 });
        }
        const users = await User.find({ email: email });

        return NextResponse.json(users, { status: 200 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}