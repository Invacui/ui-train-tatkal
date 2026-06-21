/**
 * @file Passenger types
 * @description Types for passenger genders, berth preferences, ID cards, and form values
 * @module types
 */

// Passenger gender options
export type Gender = 'male' | 'female' | 'other';
// Preferred berth type
export type BerthPreference = 'lower' | 'middle' | 'upper' | 'side_lower' | 'side_upper';
// Accepted government ID card types
export type IdCardType = 'aadhaar' | 'pan' | 'voter_id' | 'driving_license' | 'passport';

// A passenger on a booking
export interface Passenger {
  name: string;
  age: number;
  gender: Gender;
  berthPreference?: BerthPreference;
  seatNumber?: string;
  pnr?: string;
  idCardType?: string;
  idCardNumber?: string;
  status?: string;
}

// Form input values for adding a passenger
export interface PassengerFormValues {
  name: string;
  age: number;
  gender: Gender;
  berthPreference?: BerthPreference;
  idType?: string;
  idNumber?: string;
}
