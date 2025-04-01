import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import payment from "@/models/payment";
import connectdb from "@/database/connectdb";

export async function POST(req) {
  try {
    // Connect to database
    await connectdb();

    // Parse request body
    const { order_id, payment_id } = await req.json();

    // Validate input
    if (!order_id || !payment_id) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing order_id or payment_id" 
      }, { status: 400 });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Fetch payment details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(payment_id);

    // Check if payment is captured
    if (paymentDetails.status === 'captured') {
      // Find or create payment record in database
      const paymentRecord = await payment.findOneAndUpdate(
        { transactionId: payment_id },
        { 
          status: 'completed',
          orderId: order_id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({
        success: true,
        paymentDetails: {
          id: paymentDetails.id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          status: paymentDetails.status,
          method: paymentDetails.method,
          orderId: order_id
        }
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Payment not completed" 
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}