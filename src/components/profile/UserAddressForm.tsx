/**
 * @file UserAddressForm.tsx
 * @description Form component for capturing/editing user address with optional
 *   browser geolocation and Nominatim auto-geocoding to fill lat/lon.
 *   Coordinates are auto-detected and read-only — users never type them manually.
 * @module components/profile
 */

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/common/useGeolocation';
import { Loader2, MapPin, Crosshair } from 'lucide-react';

import type { UserAddress } from '@/types/auth.types';

interface UserAddressFormProps {
  /** Existing address to edit (undefined = add mode) */
  address?: UserAddress;
  /** Called with the final address on save */
  onSave: (address: UserAddress) => void;
  /** Called when the user cancels editing */
  onCancel: () => void;
}

/** Build a query string for Nominatim from the address fields */
function buildGeocodeQuery(form: UserAddress): string {
  const parts = [form.line1, form.line2, form.city, form.state, form.pincode, 'India'].filter(Boolean);
  return parts.join(', ');
}

/**
 * UserAddressForm
 * @description Form for entering address details with auto-geocoding via
 *   Nominatim and optional browser geolocation capture.
 */
export function UserAddressForm({ address, onSave, onCancel }: UserAddressFormProps) {
  const { latitude, longitude, requestLocation, isLoading: geoLoading } = useGeolocation();
  const [nomLoading, setNomLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout>>();

  const [form, setForm] = useState<UserAddress>({
    line1: address?.line1 || '',
    line2: address?.line2 || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    lat: address?.lat,
    lon: address?.lon,
  });

  // When browser geolocation returns a position, fill lat/lon
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setForm((prev) => ({ ...prev, lat: latitude, lon: longitude }));
      setGeoError(null);
    }
  }, [latitude, longitude]);

  /** Call Nominatim to resolve address → coordinates */
  const geocodeAddress = useCallback(async (currentForm: UserAddress) => {
    const query = buildGeocodeQuery(currentForm);
    if (query.length < 10) return;

    setNomLoading(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`,
        { headers: { 'Accept-Language': 'en' } },
      );
      if (!res.ok) throw new Error('Geocoding failed');
      const data = await res.json();
      if (data?.[0]) {
        setForm((prev) => ({ ...prev, lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }));
        setGeoError(null);
      } else {
        setGeoError('Could not auto-detect location from address');
      }
    } catch {
      setGeoError('Could not auto-detect location');
    } finally {
      setNomLoading(false);
    }
  }, []);

  // Debounced auto-geocode when address fields change
  useEffect(() => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (!form.city || !form.state) return;
    geocodeTimer.current = setTimeout(() => {
      geocodeAddress(form);
    }, 800);
    return () => { if (geocodeTimer.current) clearTimeout(geocodeTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.line1, form.line2, form.city, form.state, form.pincode, geocodeAddress]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (field: keyof UserAddress, value: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isCaptureDisabled = geoLoading || nomLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{address ? 'Edit Address' : 'Add Address'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="line1">Address Line 1 *</Label>
            <Input
              id="line1"
              value={form.line1}
              onChange={(e) => set('line1', e.target.value)}
              required
              placeholder="House / Flat / Street"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="line2">Address Line 2</Label>
            <Input
              id="line2"
              value={form.line2 || ''}
              onChange={(e) => set('line2', e.target.value)}
              placeholder="Locality / Landmark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                required
                placeholder="City"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={form.state}
                onChange={(e) => set('state', e.target.value)}
                required
                placeholder="State"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              value={form.pincode}
              onChange={(e) => set('pincode', e.target.value)}
              required
              placeholder="6-digit pincode"
              pattern="[0-9]{6}"
            />
          </div>

          {/* Coordinates — auto-detected, read-only */}
          <div className="rounded-md border p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Location Coordinates</span>
              </div>
              <div className="flex items-center gap-2">
                {(geoLoading || nomLoading) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={requestLocation}
                  disabled={isCaptureDisabled}
                >
                  <Crosshair className="mr-1 h-3 w-3" />
                  {geoLoading ? 'Detecting…' : 'Use My Location'}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={form.lat ?? ''}
                  readOnly
                  className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                  placeholder="Auto-detected"
                  tabIndex={-1}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lon">Longitude</Label>
                <Input
                  id="lon"
                  type="number"
                  step="any"
                  value={form.lon ?? ''}
                  readOnly
                  className="bg-muted/50 text-muted-foreground cursor-not-allowed"
                  placeholder="Auto-detected"
                  tabIndex={-1}
                />
              </div>
            </div>
            {geoError && (
              <p className="text-xs text-muted-foreground text-center">{geoError}</p>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Coordinates are auto-detected from your address or browser location.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Address</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
