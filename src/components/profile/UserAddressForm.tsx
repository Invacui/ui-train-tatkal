/**
 * @file UserAddressForm.tsx
 * @description Form component for capturing/editing user address with optional
 *   browser geolocation to auto-fill lat/lon.
 * @module components/profile
 */

import { useState, useEffect, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeolocation } from '@/hooks/common/useGeolocation';

import type { UserAddress } from '@/types/auth.types';

interface UserAddressFormProps {
  /** Existing address to edit (undefined = add mode) */
  address?: UserAddress;
  /** Called with the final address on save */
  onSave: (address: UserAddress) => void;
  /** Called when the user cancels editing */
  onCancel: () => void;
}

/**
 * UserAddressForm
 * @description Form for entering address details with the ability to capture
 *   current location via the browser's Geolocation API.
 */
export function UserAddressForm({ address, onSave, onCancel }: UserAddressFormProps) {
  const { latitude, longitude, requestLocation, isLoading: geoLoading } = useGeolocation();

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
    }
  }, [latitude, longitude]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (field: keyof UserAddress, value: string | number | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isCaptureDisabled = geoLoading;

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

          <div className="border rounded-md p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Geolocation</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={requestLocation}
                disabled={isCaptureDisabled}
              >
                {geoLoading ? 'Capturing...' : 'Capture My Location'}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={form.lat ?? ''}
                  onChange={(e) => set('lat', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="e.g. 28.6139"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lon">Longitude</Label>
                <Input
                  id="lon"
                  type="number"
                  step="any"
                  value={form.lon ?? ''}
                  onChange={(e) => set('lon', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="e.g. 77.2090"
                />
              </div>
            </div>
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
