/**
 * @file payments.service.ts
 * @description Payment-related API service for initiating and verifying payments.
 * @module services/payments.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Generic API response wrapper
import type { ApiResponse } from '@/types/api.types';

// Payment data types
import type { PaymentInfo, InitiatePaymentDto, RazorpayInitiateDto, RazorpayInitiateResponse, RazorpayVerifyDto, RazorpayVerifyResponse } from '@/types/payments.types';

/**
 * paymentsService
 * @description Provides methods for payment-related API operations, including initiating a payment transaction and verifying its status.
 */
export const paymentsService = {

  /**
   * initiatePayment
   * @description Initiates a payment transaction for a booking, returning payment gateway information.
   * @param {InitiatePaymentDto} dto - The payment initiation payload including booking details and amount.
   * @returns A promise resolving to an API response containing PaymentInfo with gateway details.
   */
  initiatePayment: (dto: InitiatePaymentDto) =>
    api.post<ApiResponse<PaymentInfo>>('/payments/initiate', dto),

  /**
   * verifyPayment
   * @description Verifies the status of a payment transaction by its payment ID.
   * @param {string} paymentId - The unique payment transaction identifier.
   * @returns A promise resolving to an API response containing the verified PaymentInfo.
   */
  verifyPayment: (paymentId: string) =>
    api.get<ApiResponse<PaymentInfo>>(`/payments/${paymentId}/verify`),

  // --- Razorpay methods ---

  /**
   * initiateRazorpayOrder
   * @description Creates a Razorpay order for a booking, returning order details for frontend checkout.
   * @param {RazorpayInitiateDto} dto - Initiate payload with bookingId and amount.
   * @returns A promise resolving to the Razorpay order details including order_id and key_id.
   */
  initiateRazorpayOrder: (dto: RazorpayInitiateDto) =>
    api.post<ApiResponse<RazorpayInitiateResponse>>('/payments/razorpay/initiate', dto),

  /**
   * verifyRazorpayPayment
   * @description Verifies a Razorpay payment signature after successful checkout.
   * @param {RazorpayVerifyDto} dto - Verification payload with payment details.
   * @returns A promise resolving to the booking status after verification.
   */
  verifyRazorpayPayment: (dto: RazorpayVerifyDto) =>
    api.post<ApiResponse<RazorpayVerifyResponse>>('/payments/razorpay/verify', dto),
};
