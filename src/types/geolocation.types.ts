/**
 * @file Geolocation types
 * @description Types for agent geolocation, nearby agent queries
 * @module types
 */

/** Nearby agent record returned by the geolocation API */
export interface AgentGeolocation {
  id: string;
  agencyName: string;
  ownerName: string;
  phone: string;
  rating: number;
  completedBookings: number;
  completionRate: number;
  /** Distance from user in km */
  distance: number;
  location: {
    type: 'Point';
    /** [longitude, latitude] per GeoJSON spec */
    coordinates: [number, number];
  };
  isOnline: boolean;
}

/** Query params for finding nearby agents */
export interface NearbyAgentQuery {
  userType: 'agent';
  currUserLat: number;
  currUserLong: number;
  /** Search radius in meters (default 10000) */
  maxDistance?: number;
}
