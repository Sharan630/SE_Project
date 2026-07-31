import connectDB from "@/database/connectdb"; // fix this import
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB(); // ✅ make sure you're connected

        await mongoose.connection.dropDatabase(); // 💣 drops the entire DB

        return NextResponse.json({ message: "Database dropped successfully." }, { status: 200 });
    } catch (error) {
        console.error("Error dropping database:", error);
        return NextResponse.json({ message: "Failed to drop database." }, { status: 500 });
    }
}
