import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: String,
            enum: ["free", "monthly"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            // required: true,
        },
        paymentId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Subscription = mongoose.models.Subscription || mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
