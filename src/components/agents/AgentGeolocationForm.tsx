/**
 * @file AgentGeolocationForm.tsx
 * @description Form for agents to update their current geolocation (lat/lon)
 *   using the browser Geolocation API or manual entry.
 * @module components/agents
 */

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/common/useGeolocation';
import { MapPin, Loader2 } from 'lucide-react';

interface AgentGeolocationFormProps {
  currentLocation?: { lat: number; lon: number };
  onSave: (location: { lat: number; lon: number }) => void;
  isSaving: boolean;
}

/**
 * AgentGeolocationForm
 * @description Allows agents to capture their current location via browser
 *   geolocation or enter lat/lon manually, then save to the backend.
 */
export function AgentGeolocationForm({ currentLocation, onSave, isSaving }: AgentGeolocationFormProps) {
  const { latitude, longitude, requestLocation, isLoading: geoLoading } = useGeolocation();

  const [lat, setLat] = useState(currentLocation?.lat?.toString() || '');
  const [lon, setLon] = useState(currentLocation?.lon?.toString() || '');

  // Auto-fill from geolocation when captured
  useEffect(() => {
    if (latitude !== null) setLat(latitude.toString());
    if (longitude !== null) setLon(longitude.toString());
  }, [latitude, longitude]);

  const handleSave = () => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    if (isNaN(latNum) || isNaN(lonNum)) return;
    onSave({ lat: latNum, lon: lonNum });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Update your current location so customers can find you nearby.</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="agent-lat">Latitude</Label>
            <Input
              id="agent-lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="28.6139"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="agent-lon">Longitude</Label>
            <Input
              id="agent-lon"
              type="number"
              step="any"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="77.2090"
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={requestLocation}
            disabled={geoLoading}
          >
            {geoLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Detect My Location
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !lat || !lon}>
            {isSaving ? 'Saving...' : 'Save Location'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
