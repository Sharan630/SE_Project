import User from "@/models/user";

export const updateReportCounts = async (report) => {
  try {
    // Increment reportedCount for the mentor
    await User.findByIdAndUpdate(report.mentor, {
      $inc: { reportedCount: 1 },
      $push: { reports: report._id }
    });
  } catch (error) {
    console.error("Error updating report counts:", error);
  }
};