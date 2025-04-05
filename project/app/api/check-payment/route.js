import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectdb from "@/database/connectdb";
import Payment from "@/models/payment";
import Session from "@/models/session";

export async function POST(req) {
  try {
    await connectdb();
    const { order_id, payment_id } = await req.json();
    
    if (!payment_id || !order_id) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid payment_id or order_id" 
      }, { status: 400 });
    }

    // Find payment in the database
    const paymentRecord = await Payment.findOne({ transactionId: payment_id });
    
    // If payment exists in our db, find related session
    let sessionDetails = null;
    if (paymentRecord) {
      const session = await Session.findOne({
        mentor: paymentRecord.mentorId,
        mentee: paymentRecord.menteeId
      }).sort({ createdAt: -1 });
      
      if (session) {
        sessionDetails = {
          id: session._id,
          date: session.date,
          duration: session.duration,
          status: session.status
        };
      }
    }
    
    // If we don't have the payment in our DB yet, check with Razorpay
    if (!paymentRecord) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      
      try {
        const paymentDetails = await razorpay.payments.fetch(payment_id);
        
        if (paymentDetails.status === 'captured' || paymentDetails.status === 'authorized') {
          return NextResponse.json({
            success: true,
            paymentDetails: {
              id: paymentDetails.id,
              amount: paymentDetails.amount,
              currency: paymentDetails.currency,
              status: paymentDetails.status,
              method: paymentDetails.method,
              orderId: order_id,
            },
            sessionDetails: sessionDetails
          });
        } else {
          return NextResponse.json({ 
            success: false, 
            error: "Payment not completed" 
          }, { status: 400 });
        }
      } catch (error) {
        console.error("Error fetching payment from Razorpay:", error);
        return NextResponse.json({ 
          success: false, 
          error: "Could not verify payment with Razorpay" 
        }, { status: 500 });
      }
    }
    
    // Return our existing payment record
    return NextResponse.json({
      success: true,
      paymentDetails: {
        id: paymentRecord.transactionId,
        amount: paymentRecord.amount,
        currency: paymentRecord.currency,
        status: paymentRecord.status,
        orderId: paymentRecord.orderId,
      },
      sessionDetails: sessionDetails
    });
    
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}



