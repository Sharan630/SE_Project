import mongoose from "mongoose";


const PaymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    transactionId: { type: String, unique: true }
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;
