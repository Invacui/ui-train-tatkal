/**
 * @file geolocation.service.ts
 * @description Geolocation API service for agent location updates and nearby agent queries.
 * @module services/geolocation.service
 */

import { api } from '@/lib/axios';

import type { ApiResponse } from '@/types/api.types';
import type { AgentGeolocation, NearbyAgentQuery } from '@/types/geolocation.types';

/**
 * geolocationService
 * @description Provides methods for geolocation-related API operations.
 */
export const geolocationService = {
  /**
   * updateAgentLocation
   * @description Upserts the authenticated agent's current geolocation (lat/lon).
   * @param {Object} location - Object containing lat and lon.
   * @param {number} location.lat - Latitude.
   * @param {number} location.lon - Longitude.
   * @returns A promise resolving to the updated agent profile.
   */
  updateAgentLocation: (location: { lat: number; lon: number }) =>
    api.post('/agents/geolocation', location),

  /**
   * findNearbyAgents
   * @description Finds agents near a given user location within a search radius.
   * @param {NearbyAgentQuery} params - Query params including user lat/lon and optional maxDistance.
   * @returns A promise resolving to an array of nearby AgentGeolocation objects.
   */
  findNearbyAgents: (params: NearbyAgentQuery) =>
    api.get<ApiResponse<AgentGeolocation[]>>('/user-geolocation', { params }),
};
