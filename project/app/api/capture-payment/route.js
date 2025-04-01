import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import payment from "@/models/payment";
import connectdb from "@/database/connectdb";

export async function POST(req) {
  let order_id = null;
  let payment_id = null;

  try {
    const { order_id: receivedOrderId, payment_id: receivedPaymentId } = await req.json();
    order_id = receivedOrderId;
    payment_id = receivedPaymentId;

    console.log("Attempting to capture payment:", { order_id, payment_id });

    if (!payment_id || !order_id) {
      return NextResponse.json({ error: "Invalid payment_id or order_id" }, { status: 400 });
    }

    await connectdb();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Fetch payment details
    const paymentDetails = await razorpay.payments.fetch(payment_id);

    if (paymentDetails.status === "captured") {
      await payment.findOneAndUpdate(
        { transactionId: payment_id },
        {
          status: "completed",
          orderId: order_id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ 
        redirectUrl: `payment-success?order_id=${encodeURIComponent(order_id)}&payment_id=${encodeURIComponent(payment_id)}` 
      });
    }

    // Attempt to capture payment
    const captureAmount = Number(paymentDetails.amount);
    if (isNaN(captureAmount) || captureAmount <= 0) {
      return NextResponse.json({ error: "Invalid capture amount" }, { status: 400 });
    }

    const captureResponse = await razorpay.payments.capture(payment_id, captureAmount, paymentDetails.currency);

    if (captureResponse.status === "captured") {
      await payment.findOneAndUpdate(
        { transactionId: payment_id },
        {
          status: "completed",
          orderId: order_id,
          amount: captureResponse.amount,
          currency: captureResponse.currency,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ 
        redirectUrl: `payment-success?order_id=${encodeURIComponent(order_id)}&payment_id=${encodeURIComponent(payment_id)}` 
      });
    }

    return NextResponse.json({ success: false, error: "Payment capture failed" }, { status: 400 });

  } catch (error) {
    console.error("Error capturing payment:", error);

    if (error?.error?.description?.includes("already been captured")) {
      return NextResponse.json({ 
        redirectUrl: `payment-success?order_id=${encodeURIComponent(order_id)}&payment_id=${encodeURIComponent(payment_id)}` 
      });
    }

    return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
  }
}
