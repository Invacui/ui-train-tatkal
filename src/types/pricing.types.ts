/**
 * @file Pricing types
 * @description Types for pricing configuration, matching the API's PricingConfig schema.
 *   Only one active config exists at a time — updates create a new version.
 * @module types
 */

/** Home-delivery charge breakdown (nested under PricingConfig) */
export interface HomeDeliveryCharge {
  printingCharge: number;
  handlingCharge: number;
}

/**
 * Pricing configuration model — matches GET /pricing/config response
 * and PUT /admin/pricing/config request/response from the API.
 */
export interface PricingConfig {
  _id?: string;
  /** Agent fee percentage applied to total base fare (default 5) */
  agentChargePercent: number;
  /** Platform fee percentage applied to total base fare (default 3) */
  platformFeePercent: number;
  /** Home-delivery charge breakdown */
  homeDeliveryCharge: HomeDeliveryCharge;
  /** GST percentage applied to the entire subtotal (default 18) */
  gstPercent: number;
  /** Whether this config is the active one */
  isActive: boolean;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * DTO for updating pricing config (admin only, partial update).
 * All fields are optional — only provided fields are updated.
 */
export type PricingConfigUpdateDto = Partial<Omit<PricingConfig, '_id' | 'createdAt' | 'updatedAt'>>;
