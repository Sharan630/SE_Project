import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Report from "@/models/report";

export async function GET() {
  try {
    await connectdb();
    const count = await Report.countDocuments();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}