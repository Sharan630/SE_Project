// 'use client';
// import React, { useState } from 'react';
// import Script from 'next/script';

// const PaymentPage = () => {
//   const AMOUNT = 100;
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handlePayment = async () => {
//     setIsProcessing(true);
//     try {
//       const response = await fetch('/api/create-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: AMOUNT * 100, currency: 'INR' }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create order');
//       }

//       const data = await response.json();

//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: AMOUNT * 100,
//         currency: 'INR',
//         name: 'SE Project',
//         description: 'Payment Gateway',
//         order_id: data.orderId,
//         handler: (response) => handleSuccess(response, data.orderId),
//         prefill: {
//           name: 'John Doe',
//           email: 'john@example.com',
//           contact: '9999999999',
//         },
//         notes: {
//           address: 'Example Street',
//         },
//         theme: {
//           color: '#3880ff',
//         },
//       };

//       const rzp1 = new window.Razorpay(options);
//       rzp1.open();
//     } catch (e) {
//       console.error('Error in payment', e);
//       alert('Payment failed, please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

// const handleSuccess = async (response, orderId) => {
//   setIsProcessing(false);
//   console.log('Payment Successful', response);

//   try {
//     const captureResponse = await fetch('/api/capture-payment', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         order_id: orderId,
//         payment_id: response.razorpay_payment_id,
//       }),
//     });

//     const data = await captureResponse.json();

//     if (data.redirectUrl) {
//       window.location.replace(data.redirectUrl);
//     }
//   } catch (error) {
//     console.error('Error capturing payment', error);
//   }
// };
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
//       <div className="p-6 bg-amber-50 rounded-lg shadow-md">
//         <h1 className="text-2xl font-bold mb-4">Payment Page</h1>
//         <p className="mb-4">Amount to Pay: {AMOUNT} INR</p>
//         <button
//           onClick={handlePayment}
//           disabled={isProcessing}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           {isProcessing ? 'Processing...' : 'Pay Now'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;