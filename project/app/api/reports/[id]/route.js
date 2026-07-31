import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Report from "@/models/report";

export async function PUT(request, { params }) {
  try {
    await connectdb();
    const { id } = params;
    const { status } = await request.json();

    // Validate the status
    if (!['submitted', 'under_review', 'resolved', 'dismissed'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { 
        status,
        resolvedAt: status === 'resolved' ? new Date() : null
      },
      { new: true }
    );

    if (!updatedReport) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, report: updatedReport },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}