// Fixed capture-payment API route
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import payment from "@/models/payment";
import Session from "@/models/session"; // Import Session model
import connectdb from "@/database/connectdb";

export async function POST(req) {
  let order_id = null;
  let payment_id = null;

  try {
    await connectdb();
    const { 
      order_id: receivedOrderId, 
      payment_id: receivedPaymentId,
      mentor_id: mentorId,
      mentee_id: menteeId
    } = await req.json();
    
    order_id = receivedOrderId;
    payment_id = receivedPaymentId;

    console.log("Attempting to capture payment:", { order_id, payment_id, mentorId, menteeId });

    if (!payment_id || !order_id) {
      return NextResponse.json({ error: "Invalid payment_id or order_id" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Check payment status first
    const paymentDetails = await razorpay.payments.fetch(payment_id);
    
    // Fetch order details to get session data
    const orderDetails = await razorpay.orders.fetch(order_id);

    if (paymentDetails.status === 'captured' || paymentDetails.status === 'authorized') {
      // Save payment details
      await payment.findOneAndUpdate(
        { transactionId: payment_id },
        {
          status: 'completed',
          orderId: order_id,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          mentorId: mentorId || orderDetails.notes.mentor,
          menteeId: menteeId || orderDetails.notes.mentee
        },
        { upsert: true, new: true }
      );

      // Create a new session with mentor and mentee information
      const sessionData = {
        mentor: mentorId || orderDetails.notes.mentor,
        mentee: menteeId || orderDetails.notes.mentee,
        date: new Date(orderDetails.notes.date),
        duration: Number(orderDetails.notes.duration),
        status: "scheduled"
      };
      
      // Create the session
      const session = await Session.create(sessionData);
      
      console.log("Session created:", session);

      return NextResponse.json({ 
        success: true, 
        redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`,
        sessionId: session._id
      });
    }

    // If payment is not captured, attempt to capture
    const captureResponse = await razorpay.payments.capture(payment_id, paymentDetails.amount, paymentDetails.currency);

    if (captureResponse.status === 'captured') {
      // Save payment details
      await payment.findOneAndUpdate(
        { transactionId: payment_id },
        {
          status: 'completed',
          orderId: order_id,
          amount: captureResponse.amount,
          currency: captureResponse.currency,
          mentorId: mentorId || orderDetails.notes.mentor,
          menteeId: menteeId || orderDetails.notes.mentee
        },
        { upsert: true, new: true }
      );

      // Create a new session with mentor and mentee information
      const session = await Session.create({
        mentor: mentorId || orderDetails.notes.mentor,
        mentee: menteeId || orderDetails.notes.mentee,
        date: new Date(orderDetails.notes.date),
        duration: Number(orderDetails.notes.duration),
        status: "scheduled"
      });

      return NextResponse.json({ 
        success: true, 
        redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`,
        sessionId: session._id
      });
    }

    return NextResponse.json({ success: false, error: "Payment capture failed" }, { status: 400 });

  } catch (error) {
    console.error("Error capturing payment:", error);

    // Handle already captured scenario
    if (error.error && error.error.code === "BAD_REQUEST_ERROR" &&
      error.error.description === "This payment has already been captured") {
      return NextResponse.json({ 
        success: true, 
        redirectUrl: `/payment-success?order_id=${order_id}&payment_id=${payment_id}`
      });
    }

    return NextResponse.json({ success: false, error: error.message || "Unknown error" }, { status: 500 });
  }
}