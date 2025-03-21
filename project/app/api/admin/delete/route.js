import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function DELETE(req, {params}) {
    try {
        await connectdb();

        const { email } = await params;

        if (!email) {
            return NextResponse.json({ message: "User email are required" }, { status: 400 });
        }

        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });

    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
