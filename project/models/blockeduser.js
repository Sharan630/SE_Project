import mongoose from "mongoose";

const blockedUserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            ref: "User",
            required: true,
        },
        phone: {
            type: String, trim: true
        },
        linkedin: {
            type: String, trim: true,
        },
        reason: {
            type: String,
            default: "Violation of terms",
        },
        blockedAt: {
            type: Date,
            default: Date.now,
        }
    },
    { timestamps: true }
);

const BlockedUser = mongoose.models.BlockedUser || mongoose.model("BlockedUser", blockedUserSchema);

export default BlockedUser;
