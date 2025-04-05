
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('checking');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [sessionDetails, setSessionDetails] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentId = searchParams.get('payment_id');

    if (!orderId || !paymentId) {
      setPaymentStatus('error');
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch('/api/check-payment', {
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
            setSessionDetails(data.sessionDetails);
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

  const handleGoToSessions = () => {
    router.push('/sessions');
  };

  const handleGoHome = () => {
    router.push('/home');
  };

  if (paymentStatus === 'checking') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-r-blue-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold">Checking payment status...</h2>
            <p className="text-gray-500 mt-2">Please wait while we verify your payment</p>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-8 max-w-md bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
            
            <div className="w-full bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm text-gray-500">Payment ID:</div>
                <div className="text-sm font-medium text-right">{paymentDetails?.id}</div>
                
                <div className="text-sm text-gray-500">Amount:</div>
                <div className="text-sm font-medium text-right">{(paymentDetails?.amount / 100).toFixed(2)} {paymentDetails?.currency}</div>
                
                <div className="text-sm text-gray-500">Session Date:</div>
                <div className="text-sm font-medium text-right">{sessionDetails?.date ? new Date(sessionDetails.date).toLocaleDateString() : 'N/A'}</div>
                
                <div className="text-sm text-gray-500">Duration:</div>
                <div className="text-sm font-medium text-right">{sessionDetails?.duration || 'N/A'} minutes</div>
              </div>
            </div>
            
            <p className="text-gray-600 text-center mb-6">
              Thank you for your payment. Your session has been successfully scheduled.
            </p>
            
            <div className="flex space-x-4">
              <button 
                onClick={handleGoToSessions}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View My Sessions
              </button>
              <button 
                onClick={handleGoHome}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h1>
            <p className="text-gray-600 text-center mb-6">
              Your payment was not successful. Please try again.
            </p>
            <button 
              onClick={handleGoHome}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Occurred</h1>
            <p className="text-gray-600 text-center mb-6">
              There was an error checking your payment status. Please contact support.
            </p>
            <button 
              onClick={handleGoHome}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default PaymentSuccessPage;