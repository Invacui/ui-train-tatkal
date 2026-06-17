/**
 * @file Trip Search Form component
 * @module components/trips/TripSearchForm
 * @description Search form for train trips with station code inputs,
 *   date picker, and a swap-stations button. Uses react-hook-form for
 *   validation and navigates to search results on submit.
 */

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// Router navigation hook
import { useNavigate } from 'react-router-dom';

// Search and swap icons
import { Search, ArrowRightLeft } from 'lucide-react';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Application route constants
import { ROUTES } from '@/constants/routes';

// Form validation rules and types
import { validationRules, type TripSearchFormValues } from '@/lib/validationRules';

interface TripSearchFormProps {
  /** When true, renders a more compact layout for embedding in smaller spaces */
  compact?: boolean;
}

/**
 * TripSearchForm
 * @description Renders a search form with From/To station code inputs,
 *   a date picker, and a swap button. On submit, navigates to the search
 *   trips route with query params for source, destination, date, etc.
 * @param props TripSearchFormProps
 * @returns A trip search form element
 */
export function TripSearchForm({ compact = false }: TripSearchFormProps) {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TripSearchFormValues>();

  const fromStation = watch('fromStationCode');
  const toStation = watch('toStationCode');

  const swapStations = () => {
    setValue('fromStationCode', toStation);
    setValue('toStationCode', fromStation);
  };

  const onSubmit = (values: TripSearchFormValues) => {
    const params = new URLSearchParams({
      source: values.fromStationCode,
      destination: values.toStationCode,
      date: values.travelDate,
      passengers: String(values.passengerCount || 1),
      class: values.seatClass || '',
    });
    navigate(`${ROUTES.searchTrips}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className={`flex flex-col gap-3 ${compact ? '' : 'sm:flex-row sm:items-end'}`}>
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <Input
            placeholder="Station code (e.g. HWH, NDLS)"
            {...register('fromStationCode', validationRules.stationCode)}
          />
          {errors.fromStationCode && (
            <p className="text-xs text-destructive">{errors.fromStationCode.message}</p>
          )}
        </div>

        <button
          type="button"
          onClick={swapStations}
          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border hover:bg-accent sm:mb-2"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <Input
            placeholder="Station code (e.g. NDLS, BCT)"
            {...register('toStationCode', validationRules.stationCode)}
          />
          {errors.toStationCode && (
            <p className="text-xs text-destructive">{errors.toStationCode.message}</p>
          )}
        </div>

        <div className="space-y-1 sm:w-44">
          <label className="text-xs font-medium text-muted-foreground">Date</label>
          <Input
            type="date"
            min={new Date().toISOString().split('T')[0]}
            {...register('travelDate', validationRules.travelDate)}
          />
          {errors.travelDate && (
            <p className="text-xs text-destructive">{errors.travelDate.message}</p>
          )}
        </div>

        <Button type="submit" className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
