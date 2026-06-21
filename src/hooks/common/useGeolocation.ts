/**
 * @file useGeolocation.ts
 * @description Hook wrapping the Browser Geolocation API for capturing user lat/lon.
 * @module hooks/common
 */

import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationReturn extends GeolocationState {
  /** Request geolocation from the browser */
  requestLocation: () => void;
  /** Reset geolocation state */
  reset: () => void;
}

/**
 * useGeolocation
 * @description Wraps the Browser Geolocation API. Call `requestLocation()` to prompt
 *   the user for permission and obtain current position.
 * @returns Current geolocation state and control functions.
 */
export function useGeolocation(): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
    isLoading: false,
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported by this browser.' }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          error: null,
          isLoading: false,
        });
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Failed to retrieve location.',
        }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, []);

  const reset = useCallback(() => {
    setState({ latitude: null, longitude: null, accuracy: null, error: null, isLoading: false });
  }, []);

  return { ...state, requestLocation, reset };
}
