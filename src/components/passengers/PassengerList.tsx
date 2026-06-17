/**
 * @file Passenger List component
 * @module components/passengers/PassengerList
 * @description Renders a list of passenger forms for a booking. Each form
 *   collects name, age, gender, berth preference, and ID details.
 *   Supports adding/removing passengers up to a configurable max count.
 */

// Shadcn button component
import { Button } from '@/components/ui/button';

// Add passenger icon
import { UserPlus } from 'lucide-react';

// Individual passenger form component
import { PassengerForm } from './PassengerForm';

// Passenger form values type
import type { PassengerDetailsFormValues } from '@/lib/validationRules';

interface PassengerListProps {
  /** Array of passenger form values */
  passengers: PassengerDetailsFormValues[];
  /** Callback when a passenger's fields change */
  onChange: (index: number, values: PassengerDetailsFormValues) => void;
  /** Callback to add a new empty passenger form */
  onAdd: () => void;
  /** Callback to remove a passenger form by index */
  onRemove: (index: number) => void;
  /** Maximum number of passengers allowed (default: 6) */
  maxPassengers?: number;
}

/**
 * PassengerList
 * @description Renders a list of passenger form rows. Shows an "Add Passenger"
 *   button until the max count is reached, and a max-passengers info message.
 * @param props PassengerListProps
 * @returns A list of passenger forms with add/remove controls
 */
export function PassengerList({
  passengers,
  onChange,
  onAdd,
  onRemove,
  maxPassengers = 6,
}: PassengerListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Passenger Details</h3>
        {passengers.length < maxPassengers && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAdd}
            className="gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add Passenger
          </Button>
        )}
      </div>

      {passengers.map((p, i) => (
        <PassengerForm
          key={i}
          index={i}
          values={p}
          onChange={onChange}
          onRemove={onRemove}
        />
      ))}

      <p className="text-xs text-muted-foreground">
        Max {maxPassengers} passengers per booking
      </p>
    </div>
  );
}
