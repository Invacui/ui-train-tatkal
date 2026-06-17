/**
 * @file Trip and train types
 * @description Types for train data, search parameters, and stations
 * @module types
 */

// A train with its schedule and available classes
export interface Train {
  trainNumber: string;
  trainName: string;
  sourceStationCode: string;
  destinationStationCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: TrainClass[];
  isActive: boolean;
  hasTatkal: boolean;
}

// A travel class available on a train
export interface TrainClass {
  code: string;
  name: string;
  availableSeats: number;
  fare: number;
}

// Parameters for searching train trips
export interface TripSearchParams {
  source: string;
  destination: string;
  date: string;
  class?: string;
}

// Result of a trip search containing matching trains and station info
export interface TripSearchResult {
  trains: Train[];
  sourceStation: Station;
  destinationStation: Station;
  searchDate: string;
}

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
