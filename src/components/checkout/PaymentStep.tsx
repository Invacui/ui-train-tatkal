/**
 * @file PaymentStep.tsx
 * @description Step 6: Handles the payment flow — initiates a Razorpay order,
 *   opens the Razorpay checkout modal, and verifies the payment.
 * @module components/checkout
 */

import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RazorpayCheckout } from "@/components/checkout/RazorpayCheckout";
import { ArrowLeft, Shield, IndianRupee, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useInitiateRazorpayOrder, useVerifyRazorpayPayment } from "@/hooks/payments/useRazorpay";

import type { User } from "@/types/auth.types";

interface PaymentStepProps {
  amount: number;
  bookingId: string;
  user: User;
  onPaymentSuccess: (data: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => void;
  onPaymentFailure: (error: any) => void;
  onBack: () => void;
  isProcessing: boolean;
}

/**
 * PaymentStep
 * @description Initiates a Razorpay order via the backend, then opens the Razorpay
 *   checkout modal. On success, verifies the payment signature with the backend
 *   and calls onPaymentSuccess.
 */
export function PaymentStep({
  amount,
  bookingId,
  user,
  onPaymentSuccess,
  onPaymentFailure,
  onBack,
  isProcessing,
}: PaymentStepProps) {
  const initiateOrder = useInitiateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();
  const [razorpayDetails, setRazorpayDetails] = useState<{
    razorpayOrderId: string;
    razorpayKeyId: string;
  } | null>(null);

  const handlePay = useCallback(async () => {
    try {
      const result = await initiateOrder.mutateAsync({
        bookingId,
        amount: Math.round(amount * 100), // Convert rupees to paise (Razorpay expects paise)
        // currency: 'INR',
      });

      setRazorpayDetails({
        razorpayOrderId: result.razorpayOrderId,
        razorpayKeyId: result.razorpayKeyId,
      });

      // Return the order details so the RazorpayCheckout can use them
      return result;
    } catch (err) {
      onPaymentFailure(err);
      return null;
    }
  }, [amount, bookingId, initiateOrder, onPaymentFailure]);

  const handleRazorpaySuccess = async (response: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => {
    try {
      await verifyPayment.mutateAsync({
        bookingId,
        razorpayOrderId: response.razorpayOrderId,
        razorpayPaymentId: response.razorpayPaymentId,
        razorpaySignature: response.razorpaySignature,
      });
      onPaymentSuccess(response);
    } catch (err) {
      onPaymentFailure(err);
    }
  };

  const isPending = initiateOrder.isPending || verifyPayment.isPending || isProcessing;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete your payment to confirm the booking.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Booking ID</span>
              <span className="text-sm font-mono font-medium">{bookingId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer</span>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <div className="border-t pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-primary" />
                <span className="font-semibold">Total Amount</span>
              </div>
              <span className="text-xl font-bold text-primary">{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Secured by Razorpay. Your payment information is encrypted.</span>
          </div>

          {/* Payment button */}
          {razorpayDetails ? (
            <RazorpayCheckout
              keyId={razorpayDetails.razorpayKeyId || import.meta.env.APP_RAZORPAY_KEY_ID || ""}
              orderId={razorpayDetails.razorpayOrderId}
              amount={Math.round(amount * 100)}
              bookingId={bookingId}
              prefill={{
                name: user.name,
                email: user.email,
                contact: user.phone || "",
              }}
              onSuccess={handleRazorpaySuccess}
              onFailure={onPaymentFailure}>
              <Button className="w-full" size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Pay {formatCurrency(amount)}
                  </>
                )}
              </Button>
            </RazorpayCheckout>
          ) : (
            <Button className="w-full" size="lg" onClick={handlePay} disabled={isPending}>
              {initiateOrder.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                <>
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Pay {formatCurrency(amount)}
                </>
              )}
            </Button>
          )}

          {/* Error display */}
          {initiateOrder.error && (
            <p className="text-sm text-destructive text-center">
              Failed to initiate payment. Please try again.
            </p>
          )}
          {verifyPayment.error && (
            <p className="text-sm text-destructive text-center">
              Payment verification failed. Please contact support.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isPending}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
}
