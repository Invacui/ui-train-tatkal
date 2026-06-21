/**
 * @file Payment types
 * @description Types for payment methods, statuses, and payment DTOs
 * @module types
 */

// Supported payment methods
export type PaymentMethod = 'upi' | 'credit_card' | 'debit_card' | 'net_banking' | 'wallet';
// Payment transaction status
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

// Payment record associated with a booking
export interface PaymentInfo {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: string;
  createdAt: string;
  updatedAt: string;
}

// --- Razorpay-specific types ---

/** DTO for initiating a Razorpay order */
export interface RazorpayInitiateDto {
  bookingId: string;
  amount: number;    // in paise
  currency?: string;
}

/** Response from Razorpay order initiation */
export interface RazorpayInitiateResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  bookingId: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

/** DTO for verifying a Razorpay payment after checkout */
export interface RazorpayVerifyDto {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/** Response from successful Razorpay payment verification */
export interface RazorpayVerifyResponse {
  bookingId: string;
  status: string;
  paymentId: string;
}

// Payload for initiating a payment
export interface InitiatePaymentDto {
  bookingId: string;
  method: PaymentMethod;
  upiId?: string;
  cardDetails?: {
    number: string;
    expiry: string;
    cvv: string;
    cardholderName: string;
  };
}
