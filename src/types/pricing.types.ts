/**
 * @file Pricing types
 * @description Types for pricing configuration, admin-configurable fee breakdown
 * @module types
 */

/** Pricing configuration model (fetched from DB, admin-configurable) */
export interface PricingConfig {
  brokeragePercent: number;
  agentChargePercent: number;
  baseFixedCharge: number;
  flatChargePerBooking: number;
  perKmCharge: number;
  platformCharge: number;
  homeDeliveryCharge: number;
  printingCharge: number;
  tatkalPremiumPercent: number;
  convenienceFeePercent: number;
  gstPercent: number;
  lastUpdatedBy: string;
  isActive: boolean;
}

/** DTO for updating pricing config (admin only, partial update) */
export interface PricingConfigUpdateDto {
  brokeragePercent?: number;
  agentChargePercent?: number;
  baseFixedCharge?: number;
  flatChargePerBooking?: number;
  perKmCharge?: number;
  platformCharge?: number;
  homeDeliveryCharge?: number;
  printingCharge?: number;
  tatkalPremiumPercent?: number;
  convenienceFeePercent?: number;
  gstPercent?: number;
}
