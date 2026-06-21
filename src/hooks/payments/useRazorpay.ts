/**
 * @file useRazorpay.ts
 * @description Hooks for Razorpay payment initiation and verification.
 * @module hooks/payments
 */

import { useMutation } from '@tanstack/react-query';

import { paymentsService } from '@/services/payments.service';

import type {
  RazorpayInitiateDto,
  RazorpayInitiateResponse,
  RazorpayVerifyDto,
  RazorpayVerifyResponse,
} from '@/types/payments.types';

/**
 * useInitiateRazorpayOrder
 * @description Mutation to create a Razorpay order on the backend.
 * @returns React Query mutation returning RazorpayInitiateResponse with order_id and key_id.
 */
export function useInitiateRazorpayOrder() {
  return useMutation<RazorpayInitiateResponse, Error, RazorpayInitiateDto>({
    mutationFn: async (dto: RazorpayInitiateDto) => {
      const res = await paymentsService.initiateRazorpayOrder(dto);
      return res.data.data;
    },
  });
}

/**
 * useVerifyRazorpayPayment
 * @description Mutation to verify a Razorpay payment signature after checkout.
 * @returns React Query mutation returning RazorpayVerifyResponse with booking status.
 */
export function useVerifyRazorpayPayment() {
  return useMutation<RazorpayVerifyResponse, Error, RazorpayVerifyDto>({
    mutationFn: async (dto: RazorpayVerifyDto) => {
      const res = await paymentsService.verifyRazorpayPayment(dto);
      return res.data.data;
    },
  });
}
