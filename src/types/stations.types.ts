/**
 * @file Station types
 * @description Railway station model
 * @module types
 */

// Railway station details
export interface Station {
  code: string;
  name: string;
  city?: string;
  state?: string;
  zone?: string;
  latitude?: number;
  longitude?: number;
}
