'use client';
import React, { useState } from 'react';
import Script from 'next/script';

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountValue * 100, currency: 'INR' }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const data = await response.json();
      if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amountValue * 100,
        currency: 'INR',
        name: 'SE Project',
        description: 'Payment Gateway',
        order_id: data.orderId,
        handler: (response) => handleSuccess(response, data.orderId),
        prefill: {
          name: 'John Doe', // Fetch from user session if applicable
          email: 'john@example.com',
          contact: '9999999999',
        },
        notes: { address: 'Example Street' },
        theme: { color: '#3880ff' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error('Payment Error:', e);
      alert('Payment failed, please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccess = async (response, orderId) => {
    setIsProcessing(false);
    try {
      const captureResponse = await fetch('/api/capture-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          payment_id: response.razorpay_payment_id,
        }),
      });

      const data = await captureResponse.json();
      if (data.redirectUrl) window.location.replace(data.redirectUrl);
    } catch (error) {
      console.error('Error capturing payment:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="p-6 bg-amber-50 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-2 border rounded mb-4"
        />
        <p className="mb-4">Amount to Pay: {amount || 0} INR</p>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;