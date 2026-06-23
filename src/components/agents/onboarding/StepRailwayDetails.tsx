/**
 * @file StepRailwayDetails.tsx
 * @module components/agents/onboarding
 * @description Step 3 of the agent onboarding carousel. Collects railway-specific details.
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface RailwayDetailsData {
  isRailwayCertified: boolean;
  dailyCapacity: number;
  serviceStations: string[];
}

interface StepRailwayDetailsProps {
  defaultValues?: Partial<RailwayDetailsData>;
  onSubmit: (data: RailwayDetailsData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function StepRailwayDetails({ defaultValues, onSubmit, onBack, isSubmitting }: StepRailwayDetailsProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {
      dailyCapacity: defaultValues?.dailyCapacity || 10,
    },
  });

  const [isCertified, setIsCertified] = useState(defaultValues?.isRailwayCertified ?? false);
  const [stations, setStations] = useState<string[]>(defaultValues?.serviceStations || []);
  const [stationInput, setStationInput] = useState('');

  const addStation = () => {
    const code = stationInput.trim().toUpperCase();
    if (code && !stations.includes(code)) {
      setStations([...stations, code]);
      setStationInput('');
    }
  };

  const removeStation = (code: string) => {
    setStations(stations.filter((s) => s !== code));
  };

  return (
    <form onSubmit={handleSubmit((v) => onSubmit({
      isRailwayCertified: isCertified,
      dailyCapacity: Number(v.dailyCapacity) || 10,
      serviceStations: stations,
    }))} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Railway Details</h3>
        <p className="text-sm text-muted-foreground">Configure your railway service preferences</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRailwayCertified"
          checked={isCertified}
          onChange={(e) => setIsCertified(e.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="isRailwayCertified" className="text-sm font-medium">
          Railway certified agent
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Daily Booking Capacity *</label>
        <Input type="number" {...register('dailyCapacity', { required: true, min: 1 })} className="max-w-xs" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Service Stations</label>
        <p className="text-xs text-muted-foreground">Add station codes you serve (e.g. NDLS, HWH, BCT)</p>
        <div className="flex gap-2">
          <Input
            value={stationInput}
            onChange={(e) => setStationInput(e.target.value)}
            placeholder="NDLS"
            className="max-w-xs"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStation(); } }}
          />
          <Button type="button" variant="outline" onClick={addStation}>Add</Button>
        </div>
        {stations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {stations.map((code) => (
              <span key={code} className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium">
                {code}
                <button type="button" onClick={() => removeStation(code)} className="text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
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
