/**
 * @file Booking draft slice
 * @description Redux slice managing the multi-step booking flow state: trip search, train selection, passengers, seats, payment, and step progression
 * @module store
 */

// Redux Toolkit slice and action types
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
// Trip search parameter types
import type { TripSearchParams } from '@/types/trips.types';
// Train and train class types
import type { Train, TrainClass } from '@/types/trips.types';
// Passenger form data types
import type { PassengerFormValues } from '@/types/passengers.types';
// Seat selection types
import type { SeatSelection } from '@/types/seats.types';
// Payment method type
import type { PaymentMethod } from '@/types/payments.types';

/** Steps in the multi-step booking flow */
type BookingStep = 'search' | 'select-train' | 'passengers' | 'seats' | 'payment' | 'confirmation';

/** Booking draft state shape */
interface BookingDraftState {
  /** Current trip search parameters */
  tripSearchParams: TripSearchParams | null;
  /** The train selected by the user */
  selectedTrip: Train | null;
  /** The class selected on the chosen train */
  selectedClass: TrainClass | null;
  /** List of passenger details entered */
  passengers: PassengerFormValues[];
  /** Selected seats (coach + numbers) */
  seatSelection: SeatSelection | null;
  /** Chosen payment method */
  paymentMethod: PaymentMethod | null;
  /** Current step in the booking flow */
  currentStep: BookingStep;
  /** Whether the booking draft is complete (reached confirmation) */
  isComplete: boolean;
}

const initialState: BookingDraftState = {
  tripSearchParams: null,
  selectedTrip: null,
  selectedClass: null,
  passengers: [],
  seatSelection: null,
  paymentMethod: null,
  currentStep: 'search',
  isComplete: false,
};

export const bookingDraftSlice = createSlice({
  name: 'bookingDraft',
  initialState,
  reducers: {
    /**
     * setTripSearch
     * @description Sets the trip search parameters (source, destination, date, etc.)
     * @param state - Current booking draft state
     * @param payload - Trip search parameters
     */
    setTripSearch: (state, { payload }: PayloadAction<TripSearchParams>) => {
      state.tripSearchParams = payload;
    },
    /**
     * setSelectedTrip
     * @description Sets the selected train and class
     * @param state - Current booking draft state
     * @param payload - Object containing the selected train and class
     */
    setSelectedTrip: (state, { payload }: PayloadAction<{ trip: Train; trainClass: TrainClass }>) => {
      state.selectedTrip = payload.trip;
      state.selectedClass = payload.trainClass;
    },
    /**
     * setPassengers
     * @description Sets the list of passenger details for the booking
     * @param state - Current booking draft state
     * @param payload - Array of passenger form values
     */
    setPassengers: (state, { payload }: PayloadAction<PassengerFormValues[]>) => {
      state.passengers = payload;
    },
    /**
     * setSeatSelection
     * @description Sets the selected seats for the booking
     * @param state - Current booking draft state
     * @param payload - Seat selection (coach + seat numbers)
     */
    setSeatSelection: (state, { payload }: PayloadAction<SeatSelection>) => {
      state.seatSelection = payload;
    },
    /**
     * setPaymentMethod
     * @description Sets the chosen payment method
     * @param state - Current booking draft state
     * @param payload - Payment method enum value
     */
    setPaymentMethod: (state, { payload }: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = payload;
    },
    /** Advances the booking flow to the next step. If reaching 'confirmation', marks the draft as complete. */
    nextStep: (state) => {
      const steps: BookingStep[] = ['search', 'select-train', 'passengers', 'seats', 'payment', 'confirmation'];
      const idx = steps.indexOf(state.currentStep);
      if (idx < steps.length - 1) {
        state.currentStep = steps[idx + 1] as BookingStep;
      }
      if (state.currentStep === 'confirmation') {
        state.isComplete = true;
      }
    },
    /** Goes back to the previous step in the booking flow */
    prevStep: (state) => {
      const steps: BookingStep[] = ['search', 'select-train', 'passengers', 'seats', 'payment', 'confirmation'];
      const idx = steps.indexOf(state.currentStep);
      if (idx > 0) {
        state.currentStep = steps[idx - 1] as BookingStep;
      }
    },
    /** Resets the entire booking draft to its initial state */
    resetDraft: () => initialState,
  },
});

/** Set trip search parameters */
export const { setTripSearch, setSelectedTrip, setPassengers, setSeatSelection, setPaymentMethod, nextStep, prevStep, resetDraft } = bookingDraftSlice.actions;

/** Select the entire booking draft state */
export const selectBookingDraft = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft;
/** Select the current step in the booking flow */
export const selectCurrentStep = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft.currentStep;
/** Select the currently chosen train, or null */
export const selectSelectedTrip = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft.selectedTrip;

/** Booking draft reducer for store registration */
export const bookingDraftReducer = bookingDraftSlice.reducer;
