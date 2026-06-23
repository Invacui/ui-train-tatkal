/**
 * @file StepAddress.tsx
 * @module components/agents/onboarding
 * @description Step 2 of the agent onboarding carousel. Collects address and location.
 *   Lat/Lon are auto-filled via Nominatim geocoding from the entered address,
 *   then made read-only — users never type coordinates manually.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGeolocation } from '@/hooks/common/useGeolocation';
import { Loader2, MapPin, Crosshair } from 'lucide-react';

interface AddressData {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lon?: number;
}

interface StepAddressProps {
  defaultValues?: Partial<AddressData>;
  onSubmit: (data: { address: AddressData }) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

/** Build a query string for Nominatim from the address fields */
function buildGeocodeQuery(values: Record<string, any>): string {
  const parts = [
    values.line1,
    values.line2,
    values.city,
    values.state,
    values.pincode,
    'India',
  ].filter(Boolean);
  return parts.join(', ');
}

export function StepAddress({ defaultValues, onSubmit, onBack, isSubmitting }: StepAddressProps) {
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const { latitude, longitude, isLoading: browserGeoLoading, requestLocation } = useGeolocation();
  const geocodeTimer = useRef<ReturnType<typeof setTimeout>>();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<any>({
    defaultValues: {
      line1: defaultValues?.line1 || '',
      line2: defaultValues?.line2 || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      pincode: defaultValues?.pincode || '',
      lat: defaultValues?.lat ?? '' ,
      lon: defaultValues?.lon ?? '' ,
    },
  });

  // Watch address fields for auto-geocoding
  const watchedLine1 = watch('line1');
  const watchedCity = watch('city');
  const watchedState = watch('state');
  const watchedPincode = watch('pincode');

  /** Call Nominatim to resolve address → coordinates */
  const geocodeAddress = useCallback(async (values: Record<string, any>) => {
    const query = buildGeocodeQuery(values);
    if (query.length < 10) return; // too short to geocode

    setGeoLoading(true);
    setGeoError(null);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&limit=1`,
        { headers: { 'Accept-Language': 'en' } },
      );
      if (!res.ok) throw new Error('Geocoding request failed');
      const data = await res.json();
      if (data?.[0]) {
        setValue('lat', parseFloat(data[0].lat));
        setValue('lon', parseFloat(data[0].lon));
        setGeoError(null);
      } else {
        setGeoError('Could not auto-detect location from address');
      }
    } catch {
      setGeoError('Could not auto-detect location');
    } finally {
      setGeoLoading(false);
    }
  }, [setValue]);

  // Debounced auto-geocode when address fields change
  useEffect(() => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (!watchedCity || !watchedState) return;
    geocodeTimer.current = setTimeout(() => {
      geocodeAddress({ line1: watchedLine1, city: watchedCity, state: watchedState, pincode: watchedPincode });
    }, 800);
    return () => { if (geocodeTimer.current) clearTimeout(geocodeTimer.current); };
  }, [watchedLine1, watchedCity, watchedState, watchedPincode, geocodeAddress]);

  // When browser geolocation returns a position, fill lat/lon
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setValue('lat', latitude);
      setValue('lon', longitude);
      setGeoError(null);
    }
  }, [latitude, longitude, setValue]);

  return (
    <form onSubmit={handleSubmit((v) => onSubmit({
      address: {
        line1: v.line1,
        line2: v.line2 || undefined,
        city: v.city,
        state: v.state,
        pincode: v.pincode,
        lat: v.lat ? Number(v.lat) : undefined,
        lon: v.lon ? Number(v.lon) : undefined,
      },
    }))} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Address & Location</h3>
        <p className="text-sm text-muted-foreground">Where is your business located?</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Address Line 1 *</label>
        <Input {...register('line1', { required: 'Address is required' })} placeholder="Shop No. 42, Main Road" />
        {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message as string}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Address Line 2</label>
        <Input {...register('line2')} placeholder="Near Railway Station" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">City *</label>
          <Input {...register('city', { required: 'City is required' })} placeholder="Delhi" />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message as string}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State *</label>
          <Input {...register('state', { required: 'State is required' })} placeholder="Delhi" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Pincode *</label>
        <Input {...register('pincode', { required: 'Pincode is required', pattern: { value: /^[0-9]{6}$/, message: 'Invalid pincode' } })} placeholder="110001" />
        {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message as string}</p>}
      </div>

      {/* Coordinates — auto-detected, read-only */}
      <div className="rounded-md border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Location Coordinates</span>
          </div>
          <div className="flex items-center gap-2">
            {geoLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={requestLocation}
              disabled={browserGeoLoading}
            >
              <Crosshair className="mr-1 h-3 w-3" />
              {browserGeoLoading ? 'Detecting…' : 'Use My Location'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Latitude</label>
            <Input
              type="number"
              step="any"
              readOnly
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              {...register('lat')}
              placeholder="Auto-detected from address"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Longitude</label>
            <Input
              type="number"
              step="any"
              readOnly
              className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              {...register('lon')}
              placeholder="Auto-detected from address"
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

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Next →'}
        </Button>
      </div>
    </form>
  );
}
