/**
 * @file trips.service.ts
 * @description Trip and train-related API service for searching trains, retrieving train details, station lookups, and availability calendar.
 * @module services/trips.service
 */

import { api } from '@/lib/axios';

import type { ApiResponse } from '@/types/api.types';
import type { Train, TripSearchParams, Station } from '@/types/trips.types';
import type { CustomAvailabilityCalendar } from '@/types/calendar.types';

/**
 * tripsService
 * @description Provides methods for train and station-related API operations, including searching for trains
 * between stations, fetching train details by number, finding nearby stations, and querying the availability calendar.
 */
export const tripsService = {

  /**
   * searchTrains
   * @description Searches for available trains based on source, destination, date, and optional filters.
   * Accepts pagination params (page, pageSize) for offset-based pagination.
   * @param {TripSearchParams} params - Search parameters including source, destination, date, and optional filters.
   * @returns A promise resolving to an API response containing an array of matching Train objects.
   */
  searchTrains: (params: TripSearchParams) =>
    api.get<ApiResponse<Train[]>>('/trains/search', { params }),

  /**
   * getTrainDetail
   * @description Fetches detailed information about a specific train by its train number.
   * @param {string} trainNumber - The unique train number identifier.
   * @returns A promise resolving to an API response containing the Train details.
   */
  getTrainDetail: (trainNumber: string) =>
    api.get<ApiResponse<Train>>(`/trains/${trainNumber}`),

  /**
   * getAvailabilityCalendar
   * @description Gets daily availability states for a route over a date range.
   * Used to power the date-picker / availability heatmap on search results.
   * @param {string} source - Origin station code (e.g. "NDLS").
   * @param {string} destination - Destination station code (e.g. "MMCT").
   * @param {string} startDate - Start date in DD-MM-YYYY format (required by API).
   * @param {number} [days=16] - Number of days to include (max 30).
   * @returns A promise resolving to an API response with the availability calendar.
   */
  getAvailabilityCalendar: (source: string, destination: string, startDate: string, days = 16) =>
    api.get<ApiResponse<CustomAvailabilityCalendar>>('/trains/availability-calendar', {
      params: { source, destination, startDate, days },
    }),

  /**
   * getNearbyStations
   * @description Retrieves a list of train stations near given lat/lng coordinates.
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
   * @description Searches for stations by name or code query string.
   * @param {string} query - The search query (station name or code).
   * @returns A promise resolving to an API response containing an array of matching Station objects.
   */
  searchStations: (query: string) =>
    api.get<ApiResponse<Station[]>>('/trains/nearby-stations', {
      params: { q: query },
    }),
};
