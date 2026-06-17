/**
 * @file Passenger Form component
 * @module components/passengers/PassengerForm
 * @description Form row for a single passenger in a booking. Collects
 *   name, age, gender, berth preference, ID card type, and ID number.
 *   Syncs changes to the parent via onChange callback.
 */

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// Icons for remove and add actions
import { X, UserPlus } from 'lucide-react';

// Shadcn button and input
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Enum constants for dropdown options
import { BERTH_PREFERENCES, GENDERS, ID_CARD_TYPES } from '@/constants/enums.constant';

// Form validation rules and types
import { validationRules, type PassengerDetailsFormValues } from '@/lib/validationRules';

interface PassengerFormProps {
  /** The index of this passenger in the list */
  index: number;
  /** Callback to remove this passenger form */
  onRemove: (index: number) => void;
  /** Callback when any field changes, passing the full form values */
  onChange: (index: number, values: PassengerDetailsFormValues) => void;
  /** Current form values for this passenger */
  values: PassengerDetailsFormValues;
}

/**
 * PassengerFormRow
 * @description Renders a single passenger form row with fields for name,
 *   age, gender, berth preference, ID card type, and ID number. Watches
 *   all fields and syncs changes to the parent component.
 * @param props PassengerFormProps
 * @returns A passenger form section
 */
function PassengerFormRow({ index, onRemove, onChange, values }: PassengerFormProps) {
  const { register, watch } = useForm<PassengerDetailsFormValues>({ defaultValues: values });

  // Sync changes to parent
  const watched = watch();
  const handleFieldChange = () => {
    onChange(index, watched);
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-medium">Passenger {index + 1}</h4>
        {index > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" onChange={handleFieldChange}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input {...register('name', validationRules.passengerName)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Age</label>
          <Input type="number" min={1} max={120} {...register('age', { valueAsNumber: true, ...validationRules.age } as any)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Gender</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            {...register('gender', validationRules.gender)}
          >
            <option value="">Select</option>
            {GENDERS.map((g) => (
              <option key={g} value={g.toLowerCase()}>{g}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Berth Preference</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            {...register('berthPreference')}
          >
            <option value="">No Preference</option>
            {BERTH_PREFERENCES.map((b) => (
              <option key={b} value={b.toLowerCase()}>{b.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Type</label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            {...register('idCardType', validationRules.idCardType)}
          >
            <option value="">Select</option>
            {ID_CARD_TYPES.map((t) => (
              <option key={t} value={t.toLowerCase()}>{t.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Number</label>
          <Input {...register('idCardNumber', validationRules.idNumber)} />
        </div>
      </div>
    </div>
  );
}

// Export as both named and default
export { PassengerFormRow as PassengerForm };
