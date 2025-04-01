import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initialize Razorpay outside the handler to improve performance
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    // Parse request body
    const { amount, currency = "INR", items } = await req.json();

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ 
        error: "Invalid amount" 
      }, { status: 400 });
    }

    // Generate a unique receipt ID
    const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substring(7)}`;


    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: parseInt(amount, 10), // Convert to paise/cents
      currency: currency.toUpperCase(),
      receipt: receiptId,
      notes: {
        // Optional: Add additional order metadata
        items: JSON.stringify(items || []),
        createdAt: new Date().toISOString()
      }
    });

    // Return order details
    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receiptId: order.receipt
    }, { status: 200 });

  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    
    // Detailed error logging
    return NextResponse.json({ 
      error: "Failed to create Razorpay order",
      details: error.message 
    }, { status: 500 });
  }
}