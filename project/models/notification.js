import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
export default Notification;