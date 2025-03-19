import db from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcrypt";


export async function POST(req) {
    try {

        await db.connect();

        const { email, pass } = await req.json();
        if (!email || !pass) {
            return NextResponse.json({ message: "provide parameters" }, { status: 404 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return NextResponse.json({ message: "Wrong email" }, { status: 404 });
        }

        const compare = bcrypt.compare(pass, user.password);

        if (compare) {
            return NextResponse.json({ message: "Correct parameters" }, { status: 200 });
        }

        return NextResponse.json({ message: "Wrong password" }, { status: 201 });


    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}