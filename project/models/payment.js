// import mongoose from "mongoose";


// const PaymentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
//     amount: { type: Number, required: true },
//     status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
//     transactionId: { type: String, unique: true }
// }, { timestamps: true });

// const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
// export default Payment;

// import mongoose from "mongoose";


// const PaymentSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
//     amount: { type: Number, required: true },
//     status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
//     transactionId: { type: String, unique: true }
// }, { timestamps: true });

// const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
// export default Payment;

// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//   transactionId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   orderId: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   currency: {
//     type: String,
//     default: 'INR'
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);


import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    menteeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;