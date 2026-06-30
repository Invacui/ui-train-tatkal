/**
 * @file AgentMapView.tsx
 * @description Leaflet map component showing user location and nearby agent markers.
 *   Lazy-loaded to avoid bundle size impact from Leaflet library.
 * @module components/checkout
 */

import { useEffect, useRef, useState } from 'react';
import { Navigation, CheckCircle, Clock, Star } from 'lucide-react';

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
  const [hoveredAgent, setHoveredAgent] = useState<AgentGeolocation | null>(null);
  const [mapReady, setMapReady] = useState(false);

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

        // User marker + agent markers both go here now — map is ready
        setMapReady(true);

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
      setMapReady(false);
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
          const pinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
            <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="#10b981" stroke="white" stroke-width="2"/>
            <circle cx="14" cy="14" r="6" fill="white"/>
          </svg>`;
          const icon = L.icon({
            iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(pinSvg),
            iconSize: [28, 40],
            iconAnchor: [14, 40],
          });
          const marker = L.marker([lat, lng], { icon })
            .addTo(map)
            .bindPopup(
              `<b>${agent.agencyName || 'Agent'}</b><br/>📏 ${(agent.distance ?? 0).toFixed(1)} km away${agent.rating ? `<br/>⭐ ${agent.rating} / 5` : ''}${agent.completedBookings ? `<br/>✅ ${agent.completedBookings} bookings` : ''}${typeof agent.completionRate === 'number' ? `<br/>📊 ${agent.completionRate}% success` : ''}`,
            );
          marker.on('click', () => onAgentSelect(agent));
          marker.on('mouseover', () => setHoveredAgent(agent));
          marker.on('mouseout', () => setHoveredAgent(null));
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
  }, [agents, selectedAgentId, userLocation, mapReady]); // onAgentSelect omitted — unstable callback identity

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

      {/* Hover card — shown when hovering a pin on the map */}
      {!isSearching && hoveredAgent && (
        <div className="rounded-lg border bg-card text-card-foreground p-3 shadow-sm animate-in fade-in-0 slide-in-from-top-1 duration-150">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm truncate">{hoveredAgent.agencyName || 'Agent'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {(hoveredAgent.distance ?? 0).toFixed(1)} km away
                {hoveredAgent.rating > 0 && (
                  <span className="ml-2 text-amber-500">{hoveredAgent.rating} ★</span>
                )}
              </p>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" title="Agent location" />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {hoveredAgent.completedBookings ?? 0} booking{hoveredAgent.completedBookings !== 1 ? 's' : ''}
            </span>
            {typeof hoveredAgent.completionRate === 'number' && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {hoveredAgent.completionRate}% success
              </span>
            )}
            {hoveredAgent.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {hoveredAgent.rating} / 5
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
