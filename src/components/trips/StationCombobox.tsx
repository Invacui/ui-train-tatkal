/**
 * @file Station Input component
 * @module components/trips/StationCombobox
 * @description Plain text input for entering a station name or code.
 *   No autocomplete API — station search backend is not available yet.
 */

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface StationComboboxProps {
  value: string;
  onChange: (stationCode: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * StationCombobox
 * @description A plain text input for entering a station name or code.
 *   Autocomplete API is not yet available, so this is a simple input
 *   field that stores the entered value as-is.
 */
export function StationCombobox({
  value,
  onChange,
  placeholder = 'Search station...',
  error,
  disabled = false,
}: StationComboboxProps) {
  return (
    <div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-destructive')}
      />
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
