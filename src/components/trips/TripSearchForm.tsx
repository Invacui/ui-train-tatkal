/**
 * @file Trip Search Form component
 * @module components/trips/TripSearchForm
 * @description Enhanced search form for train trips with Headless UI
 *   Combobox for station search, Listbox for class/passenger selection,
 *   and a swap-stations button. Uses react-hook-form for validation and
 *   navigates to search results on submit.
 */

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { validationRules, type TripSearchFormValues } from '@/lib/validationRules';
import { StationCombobox } from './StationCombobox';
import { ClassListbox } from './ClassListbox';
import { PassengerCountSelect } from './PassengerCountSelect';

interface TripSearchFormProps {
  compact?: boolean;
  /** Initial values for the form (used on the results page to pre-fill) */
  initialValues?: Partial<TripSearchFormValues>;
  /** Called when values change in compact mode (for parent state sync) */
  onValuesChange?: (values: Partial<TripSearchFormValues>) => void;
}

/**
 * TripSearchForm
 * @description Enhanced search form with station autocomplete (Headless UI
 *   Combobox), class selector (Listbox), passenger count selector, and
 *   future-only date picker. Swap button exchanges from/to stations.
 */
export function TripSearchForm({
  compact = false,
  initialValues,
  onValuesChange,
}: TripSearchFormProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TripSearchFormValues>({
    defaultValues: {
      fromStationCode: initialValues?.fromStationCode ?? '',
      toStationCode: initialValues?.toStationCode ?? '',
      travelDate: initialValues?.travelDate ?? '',
      passengerCount: initialValues?.passengerCount ?? 1,
      seatClass: initialValues?.seatClass ?? '',
    },
  });

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

  const handleFieldChange = () => {
    if (onValuesChange) {
      const values = watch();
      onValuesChange(values);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Stations row: from / swap / to */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* From Station */}
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <StationCombobox
            value={fromStation}
            onChange={(code) => {
              setValue('fromStationCode', code);
              handleFieldChange();
            }}
            placeholder="From station"
            error={errors.fromStationCode?.message}
          />
        </div>

        {/* Swap button */}
        <button
          type="button"
          onClick={swapStations}
          className="mx-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border hover:bg-accent sm:mb-2"
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>

        {/* To Station */}
        <div className="flex-1 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <StationCombobox
            value={toStation}
            onChange={(code) => {
              setValue('toStationCode', code);
              handleFieldChange();
            }}
            placeholder="To station"
            error={errors.toStationCode?.message}
          />
        </div>
      </div>

      {/* Details row: date / class / passengers / button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {/* Date */}
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

        {/* Class (hidden in compact mode) */}
        {!compact && (
          <div className="space-y-1 sm:w-36">
            <label className="text-xs font-medium text-muted-foreground">Class</label>
            <ClassListbox
              value={watch('seatClass')}
              onChange={(val) => {
                setValue('seatClass', val);
                handleFieldChange();
              }}
            />
          </div>
        )}

        {/* Passengers (hidden in compact mode) */}
        {!compact && (
          <div className="space-y-1 sm:w-40">
            <label className="text-xs font-medium text-muted-foreground">Passengers</label>
            <PassengerCountSelect
              value={watch('passengerCount')}
              onChange={(val) => {
                setValue('passengerCount', val);
                handleFieldChange();
              }}
            />
          </div>
        )}

        {/* Search button */}
        <Button type="submit" className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
    </form>
  );
}
