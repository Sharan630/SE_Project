import connectdb from "@/database/connectdb";
import { NextResponse } from "next/server";
import Report from "@/models/report";
import { updateReportCounts } from "../../middlewares/reportMiddleware";

import User from "@/models/user";
import { MdOutlineNetworkWifi } from "react-icons/md";

export async function POST(request) {
  try {
    await connectdb();
    const { mentorId, menteeId, reason, description, status } = await request.json();
    console.log(mentorId, menteeId, reason, description, status);

    // Validate required fields
    if (!mentorId || !menteeId || !reason) {
      return NextResponse.json(
        { error: "Mentor ID, mentee ID, and reason are required" },
        { status: 400 }
      );
    }

    // Check if both users exist
    const mentor = await User.findById(mentorId);
    const mentee = await User.findById(menteeId);

    console.log(mentor, mentee);

    if (!mentor || !mentee) {
      return NextResponse.json(
        { error: "Mentor or mentee not found" },
        { status: 404 }
      );
    }

    // Create new report
    const newReport = new Report({
      mentor: mentorId,
      mentee: menteeId,
      reason,
      description: description || "",
      status: status || "submitted"
    });

    await newReport.save();
    await updateReportCounts(newReport);

    return NextResponse.json(
      { success: true, report: newReport },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectdb();
    const { searchParams } = new URL(request.url);
    const mentorId = searchParams.get('mentorId');
    const menteeId = searchParams.get('menteeId');

    let query = {};
    if (mentorId) query.mentor = mentorId;
    if (menteeId) query.mentee = menteeId;

    const reports = await Report.find(query)
      .populate('mentor', 'name email')
      .populate('mentee', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}