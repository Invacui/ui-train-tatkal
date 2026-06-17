/**
 * @file Station Autocomplete component
 * @module components/trips/StationAutoComplete
 * @description An autocomplete input for railway stations. Queries the
 *   stations API as the user types, shows a dropdown of matching stations
 *   (name, code, city), and calls onChange with the selected station.
 */

// React hooks for state, refs, and effects
import { useState, useRef, useEffect } from 'react';

// Shadcn input component
import { Input } from '@/components/ui/input';

// Stations query hook
import { useStations } from '@/hooks/trips/useStations';

// Utility for conditional class names
import { cn } from '@/lib/utils';

// Station type
import type { Station } from '@/types/stations.types';

interface StationAutoCompleteProps {
  /** The currently selected station code value */
  value: string;
  /** Callback when a station is selected from the dropdown */
  onChange: (station: Station) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Optional error text displayed below the input */
  error?: string;
}

/**
 * StationAutoComplete
 * @description An autocomplete input that fetches stations matching the
 *   user's query, displays them in a dropdown, and calls onChange with
 *   the full station object when selected. Handles clicks outside to close.
 * @param props StationAutoCompleteProps
 * @returns An input with a dropdown station list
 */
export function StationAutoComplete({
  value,
  onChange,
  placeholder = 'Search station...',
  error,
}: StationAutoCompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const { data: stations = [], isLoading } = useStations(query);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (station: Station) => {
    onChange(station);
    setSelectedLabel(`${station.name} (${station.code})`);
    setQuery(`${station.code}`);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <Input
        value={selectedLabel || query}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedLabel('');
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
          {isLoading && (
            <div className="px-3 py-2 text-sm text-muted-foreground">Searching...</div>
          )}
          {!isLoading && stations.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No stations found</div>
          )}
          {stations.map((station) => (
            <button
              key={station.code}
              type="button"
              onClick={() => handleSelect(station)}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent',
                value === station.code && 'bg-accent',
              )}
            >
              <span className="font-medium">{station.name}</span>
              <span className="text-xs text-muted-foreground">({station.code})</span>
              {station.city && (
                <span className="ml-auto text-xs text-muted-foreground">{station.city}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
