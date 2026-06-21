/**
 * @file RazorpayCheckout.tsx
 * @description Razorpay checkout modal wrapper. Loads the Razorpay SDK dynamically,
 *   opens the checkout modal on trigger click, and calls onSuccess/onFailure callbacks.
 * @module components/checkout
 */

import { useCallback, useRef, type ReactNode } from 'react';

interface RazorpayCheckoutProps {
  /** Razorpay key ID from the backend initiate response */
  keyId: string;
  /** Razorpay order ID from the backend initiate response */
  orderId: string;
  /** Amount in paise */
  amount: number;
  /** Booking ID for the order */
  bookingId: string;
  /** Prefilled user details */
  prefill: { name: string; email: string; contact: string };
  /** Called on successful payment */
  onSuccess: (response: { razorpayPaymentId: string; razorpayOrderId: string; razorpaySignature: string }) => void;
  /** Called on payment failure or modal dismissal */
  onFailure: (error: any) => void;
  /** The trigger element (button) */
  children: ReactNode;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * RazorpayCheckout
 * @description Wraps a trigger element (typically a button). When clicked, dynamically
 *   loads the Razorpay checkout.js (if not already loaded) and opens the payment modal
 *   with the provided order details.
 */
export function RazorpayCheckout({
  keyId,
  orderId,
  amount,
  bookingId,
  prefill,
  onSuccess,
  onFailure,
  children,
}: RazorpayCheckoutProps) {
  const scriptLoadedRef = useRef(false);

  const loadRazorpayScript = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== 'undefined') {
        scriptLoadedRef.current = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        resolve(true);
      };
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleClick = useCallback(async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      onFailure(new Error('Failed to load Razorpay SDK. Please check your internet connection.'));
      return;
    }

    const options = {
      key: keyId,
      amount,
      currency: 'INR',
      name: 'TripTatkal',
      description: `Booking #${bookingId}`,
      order_id: orderId,
      prefill,
      theme: { color: '#3b82f6' },
      handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        onSuccess({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        });
      },
      modal: {
        ondismiss: () => {
          onFailure(new Error('Payment cancelled by user'));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      onFailure(response.error || new Error('Payment failed'));
    });

    rzp.open();
  }, [amount, bookingId, prefill, onSuccess, onFailure, loadRazorpayScript]);

  return (
    <div onClick={handleClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      {children}
    </div>
  );
}
