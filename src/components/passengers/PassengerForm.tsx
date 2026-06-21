/**
 * @file Passenger Form component
 * @module components/passengers/PassengerForm
 * @description Form row for a single passenger in a booking. Collects
 *   name, age, gender, berth preference, ID card type, and ID number.
 *   Syncs changes to the parent via onChange callback.
 *
 *   Uses shadcn Select components (radix-portalled) to avoid native
 *   <select> z-index issues where options appear behind containers.
 */

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// Icons for remove and add actions
import { X } from 'lucide-react';

// Shadcn button and input
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Shadcn select primitives
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Enum constants for dropdown options
import { BERTH_PREFERENCES, GENDERS } from '@/constants/enums.constant';

// ID card types accepted by the backend (lowercase to match Joi schema)
const ID_CARD_TYPES_MAP = [
  { value: 'aadhaar', label: 'Aadhaar' },
  { value: 'pan', label: 'PAN' },
  { value: 'passport', label: 'Passport' },
  { value: 'driving_license', label: 'Driving License' },
];

// Berth preference display options (lowercase values to match Booking types)
const BERTH_OPTIONS = [
  { value: 'lower', label: 'Lower' },
  { value: 'middle', label: 'Middle' },
  { value: 'upper', label: 'Upper' },
  { value: 'side_lower', label: 'Side Lower' },
  { value: 'side_upper', label: 'Side Upper' },
];

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
 * ShadcnSelectField
 * @description Helper to render a shadcn Select bound to react-hook-form
 *   without requiring Controller. Calls updateParent so the parent always
 *   has the latest values.
 */
function ShadcnSelectField({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string | undefined;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Select value={value || ''} onValueChange={(v) => onValueChange(v === '' ? '' : v)}>
      <SelectTrigger className="h-9">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
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
  const { register, watch, getValues, setValue } = useForm<PassengerDetailsFormValues>({ defaultValues: values });

  // Sync all current form values to the parent.
  // Uses getValues (not watch) so it works immediately after setValue calls.
  const syncToParent = () => {
    onChange(index, getValues());
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <Input {...register('name', validationRules.passengerName)} onBlur={syncToParent} />
        </div>

        {/* Age */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Age</label>
          <Input
            type="number"
            min={1}
            max={120}
            {...register('age', { valueAsNumber: true, ...validationRules.age } as any)}
            onBlur={syncToParent}
          />
        </div>

        {/* Gender - shadcn Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Gender</label>
          <ShadcnSelectField
            value={watch('gender')}
            onValueChange={(v) => {
              setValue('gender', v as any, { shouldDirty: true });
              // setValue doesn't trigger watch immediately, so schedule sync
              setTimeout(syncToParent, 0);
            }}
            placeholder="Select"
            options={GENDERS.map((g) => ({ value: g.toLowerCase(), label: g }))}
          />
        </div>

        {/* Berth Preference - shadcn Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Berth Preference</label>
          <ShadcnSelectField
            value={watch('berthPreference') || ''}
            onValueChange={(v) => {
              setValue('berthPreference', v || undefined, { shouldDirty: true });
              setTimeout(syncToParent, 0);
            }}
            placeholder="No Preference"
            options={BERTH_OPTIONS}
          />
        </div>

        {/* ID Card Type - shadcn Select */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Card Type</label>
          <ShadcnSelectField
            value={watch('idType') || ''}
            onValueChange={(v) => {
              setValue('idType', v || undefined, { shouldDirty: true });
              setTimeout(syncToParent, 0);
            }}
            placeholder="Select"
            options={ID_CARD_TYPES_MAP}
          />
        </div>

        {/* ID Number */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">ID Number</label>
          <Input {...register('idNumber', validationRules.idNumber)} onBlur={syncToParent} />
        </div>
      </div>
    </div>
  );
}

// Export as both named and default
export { PassengerFormRow as PassengerForm };
