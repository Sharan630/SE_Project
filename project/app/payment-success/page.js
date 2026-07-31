import { Suspense } from 'react';
import PaymentSuccessPage from './paymentclient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8">Loading payment...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}
