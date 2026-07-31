import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        room: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        // New fields for file sharing
        fileUrl: {
            type: String,
        },
        fileName: {
            type: String,
        },
        fileType: {
            type: String,
        }
    },
    { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;