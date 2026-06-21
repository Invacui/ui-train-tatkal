/**
 * @file AgentMapView.tsx
 * @description Leaflet map component showing user location and nearby agent markers.
 *   Lazy-loaded to avoid bundle size impact from Leaflet library.
 * @module components/checkout
 */

import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

import type { AgentGeolocation } from '@/types/geolocation.types';

interface AgentMapViewProps {
  agents: AgentGeolocation[];
  /** User's current location */
  userLocation: { lat: number; lon: number } | null;
  selectedAgentId?: string;
  onAgentSelect: (agent: AgentGeolocation) => void;
  onProceed: () => void;
  isSearching: boolean;
}

/**
 * AgentMapView
 * @description Renders a Leaflet map with the user's location (blue) and nearby
 *   agent markers (green). Also shows a sidebar list of agents.
 *
 *   NOTE: Leaflet is dynamically imported to keep the bundle lean. The map
 *   container only renders after the import resolves. Leaflet CSS is also
 *   dynamically imported to ensure tiles render at the correct size.
 *
 *   ResizeObserver fixes the common "only 1-2 tiles visible" issue when the
 *   map mounts in a container that hasn't finished laying out (e.g. inside a
 *   multi-step form or a transition).
 */
export function AgentMapView({
  agents,
  userLocation,
  selectedAgentId,
  onAgentSelect,
  onProceed,
  isSearching,
}: AgentMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Dynamically load Leaflet (+ CSS) and render the map
  useEffect(() => {
    let cancelled = false;
    let map: any = null;

    (async () => {
      try {
        // Import Leaflet CSS first so tiles are correctly sized
        await import('leaflet/dist/leaflet.css');
        const leaflet = await import('leaflet');
        if (cancelled || !mapContainerRef.current) return;
        const L = leaflet.default || leaflet;

        // Fix default icon paths for bundlers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapContainerRef.current) return;

        map = L.map(mapContainerRef.current, {
          zoomControl: true,
          attributionControl: false,
        }).setView(
          [userLocation?.lat || 20.5937, userLocation?.lon || 78.9629],
          10,
        );

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add user marker
        if (userLocation) {
          const userIcon = L.divIcon({
            html: '<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>',
            className: '',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
            .addTo(map)
            .bindPopup('Your Location');
        }

        markersRef.current = [];

        // Invalidate size immediately and again after layout settles
        map.invalidateSize();
        requestAnimationFrame(() => {
          if (map && mapContainerRef.current) {
            map.invalidateSize();
          }
        });

        // Watch for container size changes (layout shifts, step transitions)
        if (!resizeObserverRef.current) {
          resizeObserverRef.current = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize();
            }
          });
        }
        if (mapContainerRef.current) {
          resizeObserverRef.current.observe(mapContainerRef.current);
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to load Leaflet map:', err);
      }
    })();

    return () => {
      cancelled = true;
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Re-invalidate map size when search finishes
  // (container was hidden during initial search so map had zero dimensions)
  useEffect(() => {
    if (!isSearching && mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      requestAnimationFrame(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
    }
  }, [isSearching]);

  // Update agent markers when agents array changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    let cancelled = false;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    (async () => {
      try {
        const leaflet = await import('leaflet');
        if (cancelled) return;
        const L = leaflet.default || leaflet;

        agents.forEach((agent) => {
          const [lng, lat] = agent.location.coordinates;
          const icon = L.divIcon({
            html: `<div style="background:${
              agent.id === selectedAgentId ? '#22c55e' : '#10b981'
            };width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
            className: '',
            iconSize: [14, 14],
            iconAnchor: [7, 7],
          });
          const marker = L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(
              `<b>${agent.agencyName}</b><br/>Distance: ${agent.distance.toFixed(1)} km<br/>Rating: ${agent.rating} ★`,
            );
          marker.on('click', () => onAgentSelect(agent));
          markersRef.current.push(marker);
        });

        // Fit bounds to show all markers
        if (agents.length > 0 && userLocation) {
          const bounds = L.latLngBounds([
            [userLocation.lat, userLocation.lon],
            ...agents.map((a) => {
              const [lng, lat] = a.location.coordinates;
              return [lat, lng] as [number, number];
            }),
          ]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (err) {
        // ignore — map already failed on mount
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [agents, selectedAgentId, userLocation]); // onAgentSelect omitted — unstable callback identity

  return (
    <div className="space-y-4">
      {/* Map container (always rendered so map ref is always populated) */}
      <div className="relative h-72 w-full rounded-lg border overflow-hidden" style={{ zIndex: 0 }}>
        <div ref={mapContainerRef} className={`h-full w-full ${isSearching ? 'invisible' : ''}`} />

        {/* Searching overlay (on top of the hidden map container) */}
        {isSearching && (
          <div className="absolute inset-0 flex items-center justify-center bg-background z-[1000]">
            <div className="text-center">
              <Navigation className="h-8 w-8 animate-pulse text-primary mx-auto mb-2" />
              <p className="font-medium">Finding nearby agents...</p>
              <p className="text-sm text-muted-foreground">
                Searching for the best agents near your location
              </p>
            </div>
          </div>
        )}

        {/* No-agents overlay */}
        {!isSearching && agents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[1px] z-[1000] pointer-events-none">
            <div className="text-center p-4 rounded-lg bg-background/80">
              <Navigation className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No agents available nearby</p>
              <p className="text-xs text-muted-foreground mt-1">
                Showing your current location on the map
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Agent list */}
      {!isSearching && agents.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <p className="text-sm font-medium">Nearby Agents ({agents.length})</p>
          {agents.map((agent) => {
            const [lng, lat] = agent.location.coordinates;
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onAgentSelect(agent)}
                className={`w-full text-left rounded-md border p-3 transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{agent.agencyName}</p>
                    <p className="text-xs text-muted-foreground">
                      {agent.distance.toFixed(1)} km away · {agent.rating} ★
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{agent.completedBookings} bookings</span>
                  <span>{agent.completionRate}% success</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
