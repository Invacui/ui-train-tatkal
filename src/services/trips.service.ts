/**
 * @file trips.service.ts
 * @description Trip and train-related API service for searching trains, retrieving train details, and station lookups.
 * @module services/trips.service
 */

// Axios API handler
import { api } from '@/lib/axios';

// Generic API response wrapper
import type { ApiResponse } from '@/types/api.types';

// Train, trip search parameters, and station type definitions
import type { Train, TripSearchParams, Station } from '@/types/trips.types';

/**
 * tripsService
 * @description Provides methods for train and station-related API operations, including searching for trains between stations, fetching train details by number, and finding nearby or matching stations.
 */
export const tripsService = {

  /**
   * searchTrains
   * @description Searches for available trains based on source, destination, date, and optional filters (class, quota, etc.).
   * @param {TripSearchParams} params - Search parameters including source, destination, date, and optional filters.
   * @returns A promise resolving to an API response containing an array of matching Train objects.
   */
  searchTrains: (params: TripSearchParams) =>
    api.get<ApiResponse<Train[]>>('/trains/search', { params }),

  /**
   * getTrainDetail
   * @description Fetches detailed information about a specific train by its train number, including schedule, route, and availability.
   * @param {string} trainNumber - The unique train number identifier.
   * @returns A promise resolving to an API response containing the Train details.
   */
  getTrainDetail: (trainNumber: string) =>
    api.get<ApiResponse<Train>>(`/trains/${trainNumber}`),

  /**
   * getNearbyStations
   * @description Retrieves a list of train stations near the given latitude and longitude coordinates. Used for location-based station discovery.
   * @param {number} [lat] - The latitude of the user's location.
   * @param {number} [lng] - The longitude of the user's location.
   * @returns A promise resolving to an API response containing an array of nearby Station objects.
   */
  getNearbyStations: (lat?: number, lng?: number) =>
    api.get<ApiResponse<Station[]>>('/trains/nearby-stations', {
      params: { lat, lng },
    }),

  /**
   * searchStations
   * @description Searches for stations by name or code query string. Used for autocomplete and station selection.
   * @param {string} query - The search query (station name or code).
   * @returns A promise resolving to an API response containing an array of matching Station objects.
   */
  searchStations: (query: string) =>
    api.get<ApiResponse<Station[]>>('/trains/nearby-stations', {
      params: { q: query },
    }),
};
