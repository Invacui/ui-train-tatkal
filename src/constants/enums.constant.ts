/**
 * @file Enumerated constants
 * @description Read-only constant arrays representing domain enums (station classes, seat types, booking statuses, etc.)
 * @module constants
 */

/** Train accommodation classes */
export const STATION_CLASSES = ['1A', '2A', '3A', 'SL', 'CC', '2S', 'EC', 'EA', 'FC'] as const;
/** Available seat types on a train */
export const SEAT_TYPES = ['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER', 'WINDOW', 'AISLE'] as const;
/** Passenger berth preferences */
export const BERTH_PREFERENCES = ['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'] as const;
/** Possible booking life-cycle statuses */
export const BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'PARTIALLY_CANCELLED', 'RAC', 'WAITING_LIST'] as const;
/** Gender options for passengers */
export const GENDERS = ['MALE', 'FEMALE', 'OTHER'] as const;
/** Application user roles */
export const USER_ROLES = ['customer', 'agent', 'admin'] as const;
/** Government-issued ID card types accepted for travel */
export const ID_CARD_TYPES = ['AADHAAR', 'PAN', 'VOTER_ID', 'DRIVING_LICENSE', 'PASSPORT'] as const;
/** Supported payment methods */
export const PAYMENT_METHODS = ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'WALLET'] as const;
/** Payment transaction statuses */
export const PAYMENT_STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'] as const;
/** Agent tier levels */
export const AGENT_TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;
/** Agent account statuses */
export const AGENT_STATUSES = ['PENDING_APPROVAL', 'ACTIVE', 'SUSPENDED', 'REJECTED'] as const;
