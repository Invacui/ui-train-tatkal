/**
 * @file Booking draft slice
 * @description Redux slice managing the multi-step booking flow state:
 *   preferences → delivery → passengers → pricing → agent-matching → payment → confirmation
 * @module store
 */

// Redux Toolkit slice and action types
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// Types
import type { TripSearchParams, Train, CustomClassAvailability } from '@/types/trips.types';
import type { PassengerFormValues } from '@/types/passengers.types';
import type { UserAddress } from '@/types/auth.types';
import type { PriceBreakdown } from '@/types/bookings.types';
import type { AgentGeolocation } from '@/types/geolocation.types';
import type { PaymentMethod } from '@/types/payments.types';

/** Steps in the multi-step booking flow */
export type BookingStep =
  | 'preferences'
  | 'delivery'
  | 'passengers'
  | 'pricing'
  | 'agent-matching'
  | 'payment'
  | 'confirmation';

/** Static definitions for stepper display */
export const BOOKING_STEPS: { key: BookingStep; label: string }[] = [
  { key: 'preferences', label: 'Preferences' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'passengers', label: 'Passengers' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'agent-matching', label: 'Agent Matching' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Confirmation' },
];

/** Flexibility toggles the user sets during checkout */
export interface BookingFlexibility {
  dateFlexibility: boolean;
  trainFlexibility: boolean;
  stationFlexibility: boolean;
  travelTime?: string;
  travelTimeFlexibility?: boolean;
}

/** Home delivery choice with optional address */
export interface DeliveryChoice {
  needHomeDelivery: boolean;
  address?: UserAddress;
}

/** Booking draft state shape */
interface BookingDraftState {
  /** Current trip search parameters */
  tripSearchParams: TripSearchParams | null;
  /** The train selected by the user */
  selectedTrip: Train | null;
  /** The class availability selected on the chosen train */
  selectedClass: CustomClassAvailability | null;
  /** Flexibility toggles */
  flexibility: BookingFlexibility;
  /** Home delivery selection */
  delivery: DeliveryChoice;
  /** Passenger details entered manually */
  passengers: PassengerFormValues[];
  /** Family member IDs chosen for this booking */
  selectedFamilyMemberIds: string[];
  /** Price breakdown from server */
  priceBreakdown: PriceBreakdown | null;
  /** Nearby agents fetched for matching */
  nearbyAgents: AgentGeolocation[];
  /** Selected agent */
  selectedAgent: AgentGeolocation | null;
  /** Chosen payment method */
  paymentMethod: PaymentMethod | null;
  /** Server-assigned booking ID — set after POST /bookings at passengers→pricing transition */
  bookingId: string | null;
  /** Current step in the booking flow */
  currentStep: BookingStep;
  /** Whether the booking draft is complete (reached confirmation) */
  isComplete: boolean;
}

const initialState: BookingDraftState = {
  tripSearchParams: null,
  selectedTrip: null,
  selectedClass: null,
  flexibility: {
    dateFlexibility: false,
    trainFlexibility: false,
    stationFlexibility: false,
    travelTime: '',
    travelTimeFlexibility: false,
  },
  delivery: {
    needHomeDelivery: false,
  },
  passengers: [],
  selectedFamilyMemberIds: [],
  priceBreakdown: null,
  nearbyAgents: [],
  selectedAgent: null,
  paymentMethod: null,
  bookingId: null,
  currentStep: 'preferences',
  isComplete: false,
};

export const bookingDraftSlice = createSlice({
  name: 'bookingDraft',
  initialState,
  reducers: {
    /**
     * setTripSearch
     * @description Sets the trip search parameters.
     */
    setTripSearch: (state, { payload }: PayloadAction<TripSearchParams>) => {
      state.tripSearchParams = payload;
    },

    /**
     * setSelectedTripAndClass
     * @description Sets the selected train and the specific class availability.
     */
    setSelectedTripAndClass: (
      state,
      { payload }: PayloadAction<{ trip: Train; trainClass: CustomClassAvailability }>,
    ) => {
      state.selectedTrip = payload.trip;
      state.selectedClass = payload.trainClass;
    },

    /**
     * setFlexibility
     * @description Updates the flexibility toggles (date, train, station).
     */
    setFlexibility: (state, { payload }: PayloadAction<BookingFlexibility>) => {
      state.flexibility = payload;
    },

    /**
     * setDelivery
     * @description Sets the home delivery preference and optional address.
     */
    setDelivery: (state, { payload }: PayloadAction<DeliveryChoice>) => {
      state.delivery = payload;
    },

    /**
     * setPassengers
     * @description Sets the list of manually entered passenger details.
     */
    setPassengers: (state, { payload }: PayloadAction<PassengerFormValues[]>) => {
      state.passengers = payload;
    },

    /**
     * setSelectedFamilyMemberIds
     * @description Sets which family members are selected for this booking.
     */
    setSelectedFamilyMemberIds: (state, { payload }: PayloadAction<string[]>) => {
      state.selectedFamilyMemberIds = payload;
    },

    /**
     * setPriceBreakdown
     * @description Stores the server-computed price breakdown.
     */
    setPriceBreakdown: (state, { payload }: PayloadAction<PriceBreakdown | null>) => {
      state.priceBreakdown = payload;
    },

    /**
     * setNearbyAgents
     * @description Stores the list of nearby agents fetched for matching.
     */
    setNearbyAgents: (state, { payload }: PayloadAction<AgentGeolocation[]>) => {
      state.nearbyAgents = payload;
    },

    /**
     * setSelectedAgent
     * @description Sets the agent selected by the user.
     */
    setSelectedAgent: (state, { payload }: PayloadAction<AgentGeolocation | null>) => {
      state.selectedAgent = payload;
    },

    /**
     * setPaymentMethod
     * @description Sets the chosen payment method.
     */
    setPaymentMethod: (state, { payload }: PayloadAction<PaymentMethod>) => {
      state.paymentMethod = payload;
    },

    /**
     * setBookingId
     * @description Sets the booking ID returned from POST /bookings.
     */
    setBookingId: (state, { payload }: PayloadAction<string>) => {
      state.bookingId = payload;
    },

    /**
     * nextStep
     * @description Advances the booking flow to the next step.
     *   If reaching 'confirmation', marks the draft as complete.
     */
    nextStep: (state) => {
      const idx = BOOKING_STEPS.findIndex((s) => s.key === state.currentStep);
      if (idx < BOOKING_STEPS.length - 1) {
        const next = BOOKING_STEPS[idx + 1]!;
        state.currentStep = next.key;
      }
      if (state.currentStep === 'confirmation') {
        state.isComplete = true;
      }
    },

    /**
     * prevStep
     * @description Goes back to the previous step in the booking flow.
     */
    prevStep: (state) => {
      const idx = BOOKING_STEPS.findIndex((s) => s.key === state.currentStep);
      if (idx > 0) {
        const prev = BOOKING_STEPS[idx - 1]!;
        state.currentStep = prev.key;
      }
    },

    /**
     * goToStep
     * @description Jumps directly to a specific step (e.g., going back from confirmation).
     */
    goToStep: (state, { payload }: PayloadAction<BookingStep>) => {
      state.currentStep = payload;
    },

    /** Resets the entire booking draft to its initial state */
    resetDraft: () => initialState,
  },
});

export const {
  setTripSearch,
  setSelectedTripAndClass,
  setFlexibility,
  setDelivery,
  setPassengers,
  setSelectedFamilyMemberIds,
  setPriceBreakdown,
  setNearbyAgents,
  setSelectedAgent,
  setPaymentMethod,
  setBookingId,
  nextStep,
  prevStep,
  goToStep,
  resetDraft,
} = bookingDraftSlice.actions;

/** Select the entire booking draft state */
export const selectBookingDraft = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft;
/** Select the current step */
export const selectCurrentStep = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft.currentStep;
/** Select the currently chosen train */
export const selectSelectedTrip = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft.selectedTrip;
/** Select the currently chosen class */
export const selectSelectedClass = (s: { bookingDraft: BookingDraftState }) => s.bookingDraft.selectedClass;

/** Booking draft reducer for store registration */
export const bookingDraftReducer = bookingDraftSlice.reducer;
