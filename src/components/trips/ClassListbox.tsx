/**
 * @file Class Select component
 * @module components/trips/ClassListbox
 * @description shadcn Select for selecting a train travel class.
 *   Uses the STATION_CLASSES constant. Includes an "All Classes" option.
 */

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { STATION_CLASSES } from '@/constants/enums.constant';

interface ClassListboxProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

function getClassName(code: string): string {
  const names: Record<string, string> = {
    '1A': 'First AC',
    '2A': 'Second AC',
    '3A': 'Third AC',
    SL: 'Sleeper',
    CC: 'Chair Car',
    '2S': 'Second Sitting',
    EC: 'Executive Chair Car',
    EA: 'Anubhuti Class',
    FC: 'First Class',
  };
  return names[code] ?? code;
}

/**
 * ClassListbox
 * @description A dropdown for selecting a train travel class.
 * Shows an "All Classes" option first, followed by all available classes
 * with their human-readable names.
 */
export function ClassListbox({ value, onChange, error, disabled }: ClassListboxProps) {
  return (
    <div>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={error ? 'border-destructive' : ''}
        >
          <SelectValue placeholder="All Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Classes</SelectItem>
          {STATION_CLASSES.map((cls) => (
            <SelectItem key={cls} value={cls}>
              {cls} — {getClassName(cls)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
