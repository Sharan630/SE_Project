import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mentee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    status: { type: String, enum: ["scheduled", "completed", "canceled"], default: "scheduled" },
    feedback: { type: String, default: "" }
}, { timestamps: true });

const Session = mongoose.models.Session || mongoose.model("Session", SessionSchema);
export default Session;
