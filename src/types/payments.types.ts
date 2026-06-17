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
