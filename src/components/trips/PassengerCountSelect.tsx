/**
 * @file Passenger Count Select component
 * @module components/trips/PassengerCountSelect
 * @description shadcn Select for picking the number of passengers (1-6).
 */

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';

interface PassengerCountSelectProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/**
 * PassengerCountSelect
 * @description A dropdown for selecting the number of passengers (1-6).
 * Uses shadcn Select for consistent styling.
 */
export function PassengerCountSelect({
  value,
  onChange,
  disabled = false,
}: PassengerCountSelectProps) {
  return (
    <Select
      value={String(value)}
      onValueChange={(val) => onChange(Number(val))}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder="Passengers" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
          <SelectItem key={num} value={String(num)}>
            {num} Passenger{num > 1 ? 's' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
