/**
 * @file Pricing constants
 * @description Default fallback values for pricing configuration.
 *   These are used when the server-side PricingConfig (from the API) hasn't
 *   loaded yet. The real values are admin-configurable via GET /pricing/config
 *   and pre-fetched into the React Query cache at the TripResults level.
 * @module constants
 */

import type { PricingConfig } from '@/types/pricing.types';

/**
 * Default pricing config matching the API schema defaults.
 * Used as fallback when the server config hasn't loaded yet.
 * - agentChargePercent: 5 % of total base fare
 * - platformFeePercent: 3 % of total base fare
 * - homeDeliveryCharge: printingCharge(10) + handlingCharge(40) = ₹50 total
 * - gstPercent: 18 % on subtotal (incl. all fees and delivery)
 */
export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  agentChargePercent: 5,
  platformFeePercent: 3,
  homeDeliveryCharge: {
    printingCharge: 10,
    handlingCharge: 40,
  },
  gstPercent: 18,
  isActive: true,
};

/** Computed total home-delivery charge (printing + handling) */
export const HOME_DELIVERY_TOTAL =
  DEFAULT_PRICING_CONFIG.homeDeliveryCharge.printingCharge +
  DEFAULT_PRICING_CONFIG.homeDeliveryCharge.handlingCharge;

/**
 * Human-readable labels for every PricingConfig field, keyed by the
 * interface property name. Useful for admin forms and debugging display.
 */
export const PRICING_FIELD_LABELS: Record<string, string> = {
  agentChargePercent: 'Agent Service Fee (%)',
  platformFeePercent: 'Platform Fee (%)',
  'homeDeliveryCharge.printingCharge': 'Delivery — Printing Charge (₹)',
  'homeDeliveryCharge.handlingCharge': 'Delivery — Handling Charge (₹)',
  gstPercent: 'GST (%)',
};
