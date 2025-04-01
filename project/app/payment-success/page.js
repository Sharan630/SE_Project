
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');

    if (!orderId || !paymentId) {
      setPaymentStatus('error');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch('/api/check-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ order_id: orderId, payment_id: paymentId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setPaymentStatus('success');
            setPaymentDetails(data.paymentDetails);
          } else {
            setPaymentStatus('failed');
          }
        } else {
          setPaymentStatus('error');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('error');
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  // Add the UI for your success page here, using paymentDetails
  if (paymentStatus === 'checking') {
    return <p>Checking payment status...</p>;
  }

  if (paymentStatus === 'success') {
    return (
      <div>
        <h1>Payment Successful!</h1>
        <p>Payment ID: {paymentDetails?.id}</p>
        <p>Amount: {paymentDetails?.amount / 100} INR</p>
        {/* Add other payment details */}
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return <p>Payment Failed.</p>;
  }

  if (paymentStatus === 'error') {
    return <p>Error checking payment.</p>;
  }
};

export default PaymentSuccessPage;