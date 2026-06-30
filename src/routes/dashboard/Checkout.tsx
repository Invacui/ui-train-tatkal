/**
 * @file Checkout page
 * @module routes/dashboard/Checkout
 * @description Full multi-step checkout flow (7 steps):
 *   preferences → delivery → passengers → pricing → agent-matching → payment → confirmation
 *
 * Train data resolution (fallback chain):
 *   Tier 1 — router state (location.state.trainData) — passed from TripCard/TripDetail
 *   Tier 2 — /trains/search filtered by train_identifier_id — sourced from URL query params
 *   Tier 2.5 — synthetic Train from resumeBooking data (booking has trainNumber/class fields)
 *   This chain is re-evaluated on every render so data resolves at any stage, not just mount.
 */

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { PreferencesStep } from "@/components/checkout/PreferencesStep";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { PassengerStep } from "@/components/checkout/PassengerStep";
import { PricingStep } from "@/components/checkout/PricingStep";
import { AgentMatchingStep } from "@/components/checkout/AgentMatchingStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { ConfirmationStep } from "@/components/checkout/ConfirmationStep";

import { useTripSearch } from "@/hooks/trips/useTripSearch";
import { useCalculatePrice } from "@/hooks/bookings/useCalculatePrice";
import { useNearbyAgents } from "@/hooks/agents/useNearbyAgents";
import { useUpdateAddress } from "@/hooks/profile/useUpdateAddress";
import { useUpdateBooking } from "@/hooks/bookings/useUpdateBooking";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings.service";

import { EmailVerificationPrompt } from "@/components/auth/EmailVerificationPrompt";

import { useBooking } from "@/hooks/bookings/useBooking";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectBookingDraft,
  selectCurrentStep,
  selectSelectedTrip,
  selectSelectedClass,
  BOOKING_STEPS,
  setTripSearch,
  setSelectedTripAndClass,
  setFlexibility,
  setDelivery,
  setPassengers,
  setSelectedFamilyMemberIds,
  setPriceBreakdown,
  setNearbyAgents,
  setSelectedAgent,
  setBookingId,
  nextStep,
  prevStep,
  goToStep,
  resetDraft,
} from "@/store/booking-draft.slice";
import { selectUser } from "@/store/auth.slice";
import { ROUTES } from "@/constants/routes";

import type { AgentGeolocation } from "@/types/geolocation.types";
import type { Booking } from "@/types/bookings.types";
import type { UserAddress } from "@/types/auth.types";
import type { Train, CustomClassAvailability } from "@/types/trips.types";

/**
 * Map frontend berth preference codes to IRCTC codes expected by the backend Joi schema.
 * Backend enum: 'LB', 'UB', 'MB', 'SL', 'SU', 'WS', 'SM'
 */
const BERTH_CODE_MAP: Record<string, string> = {
  lower: "LB",
  middle: "MB",
  upper: "UB",
  side_lower: "SL",
  side_upper: "SU",
};

/**
 * Map backend IRCTC berth codes back to frontend preference codes.
 * Used when prepopulating passenger form from an existing booking.
 */
const REVERSE_BERTH_MAP: Record<string, string> = {
  LB: "lower",
  MB: "middle",
  UB: "upper",
  SL: "side_lower",
  SU: "side_upper",
};

/**
 * Normalise any train-shaped object to the canonical form used by the checkout UI.
 * Maps legacy field names to new API field names.
 */
function normaliseTrain(t: any): Train | null {
  if (!t) return null;
  return {
    ...t,
    trainNumber: t.trainNumber || t.train_number || t.train_identifier_id,
    trainName: t.trainName || t.train_name || t.train_display_name,
    sourceStationCode: t.sourceStationCode || t.origin_station_code,
    destinationStationCode: t.destinationStationCode || t.destination_station_code,
    departureTime: t.departureTime || t.departure_time_24h,
    arrivalTime: t.arrivalTime || t.arrival_time_24h,
    duration: t.duration || t.travel_duration_tt,
  } as Train;
}

/**
 * Checkout (page component)
 * @description Multi-step checkout orchestrator.
 *   Resolves train data via fallback chain:
 *   1. Router state (preferred)
 *   2. Search API + filter
 *   3. Synthetic from resume booking data
 *   Each stage independently re-resolves if the previous tier yields nothing
 *   — train data recovery works at any step, not just initial mount.
 */
export default function Checkout() {
  const { trainNumber } = useParams<{ trainNumber: string }>();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const draft = useAppSelector(selectBookingDraft);
  const currentStep = useAppSelector(selectCurrentStep);
  const selectedTrip = useAppSelector(selectSelectedTrip);
  const selectedClass = useAppSelector(selectSelectedClass);

  // ── Tier 1: Router state ──
  const stateTrainData = (location.state as { trainData?: Train })?.trainData ?? null;

  // ── URL query params (used by Tier 2 and resume) ──
  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";
  /** bookingId from URL (set by BookingCard's Continue Booking button, or URL sync effect) */
  const urlBookingId = searchParams.get("bookingId") || "";
  const selectedClassCode =
    (location.state as { selectedClassCode?: string })?.selectedClassCode ?? null;

  // ── Local state ──
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [, setGeoError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  /** True when "Continue Booking" from BookingCard passed a bookingId in the URL */
  const isResumeMode = !!urlBookingId;

  /**
   * Capture the URL bookingId at mount time — this NEVER changes even when the
   * URL sync effect later writes a freshly-created bookingId into the URL.
   * Used inside effects where we need to know if this was a genuine resume
   * (user navigated here with bookingId) vs a side-effect of URL sync.
   */
  const initialUrlBookingIdRef = useRef(urlBookingId);

  /**
   * Tracks a bookingId that was created by THIS component instance during
   * the current session (via handleCreateBooking). Used by the URL sync effect
   * to distinguish between stale Redux state (should not be written to URL)
   * and freshly-created bookings (should be written to URL so refresh works).
   */
  const sessionCreatedBookingIdRef = useRef<string | null>(null);

  /**
   * Clear stale draft from previous booking on fresh checkout mount.
   * Detects: no bookingId in the URL, but Redux still has one from an
   * earlier booking (e.g. user finished a booking then clicked "Book"
   * on a new train). Resets everything to initialState.
   *
   * Uses initialUrlBookingIdRef so the URL-sync effect cannot interfere.
   */
  useEffect(() => {
    if (!initialUrlBookingIdRef.current && draft.bookingId) {
      dispatch(resetDraft());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Resume booking data (must be above resolvedTrain — Tier 2.5 references it) ──
  const resumeBookingId: string = urlBookingId || (draft.bookingId ?? "");
  const { data: resumeBooking } = useBooking(resumeBookingId);

  // ── Tier 2: Search API (enabled only when NOT in resume mode) ──
  const tier2Enabled = !stateTrainData && !isResumeMode && !!source && !!destination && !!date && !!trainNumber;
  const { data: searchResults, isLoading: tier2Loading } = useTripSearch(
    { source, destination, date },
    tier2Enabled
  );

  // ── Resolve train data: Tier 1 → Tier 2 → Tier 2.5 (booking) ──
  const resolvedTrain: Train | null = useMemo(() => {
    // Tier 1: router state (from TripCard/TripDetail)
    if (stateTrainData) return normaliseTrain(stateTrainData);

    // Tier 2: find in search results (preferred — has fresh availability data)
    if (searchResults && trainNumber) {
      const found = searchResults.find(
        (t: Train) => (t.train_identifier_id || t.trainNumber) === trainNumber
      );
      if (found) return normaliseTrain(found);
    }

    // Tier 2.5: synthetic train from resume booking data
    // Kicks in when no router state and Tier 2 is disabled (e.g. resume mode
    // with ?bookingId= but no source/dest/date params) or returned no match.
    if (resumeBooking && resumeBooking.trainNumber) {
      const synthetic: Train = {
        trainNumber: resumeBooking.trainNumber || '',
        trainName: resumeBooking.trainName || '',
        sourceStationCode: resumeBooking.sourceStationCode || '',
        destinationStationCode: resumeBooking.destinationStationCode || '',
        departureTime: resumeBooking.departureTime || '',
        arrivalTime: resumeBooking.arrivalTime || '',
        class_availability: [{
          travel_class_code: resumeBooking.travelClass || '',
          fare_amount: resumeBooking.pricing?.baseFare || 0,
          is_bookable: true,
          quota_code: 'GN',
          availability_status_text: 'Available',
          availability_display_label: 'Available',
          booking_prediction_percentage: null,
          data_timestamp: new Date().toISOString(),
        }] as CustomClassAvailability[],
      } as Train;
      return normaliseTrain(synthetic);
    }

    return null;
  }, [stateTrainData, searchResults, resumeBooking, trainNumber]);

  // ── Init draft search params from URL ──
  useEffect(() => {
    if (source && destination && date) {
      dispatch(setTripSearch({ source, destination, date }));
    }
  }, [source, destination, date, dispatch]);

  // ── Mutations ──
  const calculatePrice = useCalculatePrice();
  const updateAddress = useUpdateAddress();
  const updateBooking = useUpdateBooking();
  const updateProfile = useUpdateProfile();

  // Nearby agents query
  const nearbyAgentsQuery = useNearbyAgents(
    currentStep === "agent-matching" && userLocation
      ? {
          userType: "agent" as const,
          currUserLat: userLocation.lat,
          currUserLong: userLocation.lon,
        }
      : null
  );

  // Sync nearby agents to store
  useEffect(() => {
    if (nearbyAgentsQuery.data) {
      dispatch(setNearbyAgents(nearbyAgentsQuery.data));
    }
  }, [nearbyAgentsQuery.data, dispatch]);

  // Initialize draft when train resolves, selecting matching class if one was pre-chosen.
  // Re-runs on resolvedTrain changes (even if selectedTrip already exists from an
  // earlier tier), so the Redux state stays in sync when a later tier produces
  // richer data.
  useEffect(() => {
    if (resolvedTrain && resolvedTrain.class_availability?.length) {
      // Don't re-dispatch if the same train is already selected
      if (selectedTrip && (selectedTrip.trainNumber === resolvedTrain.trainNumber)) return;

      let targetClass: CustomClassAvailability | null = null;
      if (selectedClassCode) {
        targetClass =
          resolvedTrain.class_availability.find((c) => c.travel_class_code === selectedClassCode) ??
          null;
      }
      dispatch(
        setSelectedTripAndClass({
          trip: resolvedTrain,
          trainClass: targetClass ?? resolvedTrain.class_availability[0]!,
        })
      );
    }
  }, [resolvedTrain, dispatch, selectedClassCode]);
  // NOTE: selectedTrip deliberately omitted from deps — we want this to fire on
  // resolvedTrain change regardless of whether selectedTrip already exists.

  // Capture user geolocation
  const captureLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => setGeoError(err.message),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  useEffect(() => {
    if ((currentStep === "delivery" || currentStep === "agent-matching") && !userLocation) {
      captureLocation();
    }
  }, [currentStep, userLocation, captureLocation]);

  // ── Resume booking prepopulation (useBooking called above at Tier 2.5) ──

  /** Ref tracking which bookingId we've already prepopulated (prevents double-fire) */
  const prepopulatedIdRef = useRef<string | null>(null);
  /** Track which form steps the user has manually modified after resume prepopulation */
  const touchedSteps = useRef<Set<string>>(new Set());
  const markTouched = useCallback((step: string) => {
    touchedSteps.current.add(step);
  }, []);

  /**
   * Prepopulate the entire draft from a resumed booking and navigate to the correct step.
   * Fires once per unique bookingId — independent of currentStep, so it works even
   * if the train-init effect has already advanced the step past "search".
   *
   * IMPORTANT: Uses `initialUrlBookingIdRef` instead of `isResumeMode` to guard
   * against the URL-sync effect race. When a fresh booking creates via POST,
   * the URL-sync effect writes bookingId into the URL, causing isResumeMode to
   * become true on the next render. Without this guard, the resume effect would
   * fire with the just-created booking's formStage and navigate BACKWARDS
   * (e.g. from delivery back to preferences), confusing the user.
   */
  useEffect(() => {
    if (!resumeBooking) return;
    if (!initialUrlBookingIdRef.current) return; // Wasn't a resume at mount — skip
    if (prepopulatedIdRef.current === resumeBooking.bookingId) return;
    prepopulatedIdRef.current = resumeBooking.bookingId;

    // Backend formStage is 1-based (1=preferences, 2=delivery, 3=passengers, 4=pricing, 5=agent-matching, 6=payment, 7=confirmation)
    // Maps directly to frontend BOOKING_STEPS index: 1→0, 2→1, ..., 7→6
    const stage = resumeBooking.formStage || 1;
    const idx = Math.max(0, stage - 1);
    const entry = BOOKING_STEPS[Math.min(idx, BOOKING_STEPS.length - 1)];
    if (!entry) return;

    // Set bookingId in store so subsequent PATCH calls reference it
    if (resumeBooking.bookingId) {
      dispatch(setBookingId(resumeBooking.bookingId));
    }

    // Always dispatch flexibility (clears stale draft state)
    dispatch(setFlexibility({
      dateFlexibility: resumeBooking.dateFlexibility ?? false,
      trainFlexibility: resumeBooking.trainFlexibility ?? false,
      stationFlexibility: resumeBooking.stationFlexibility ?? false,
      travelTime: resumeBooking.travelTime ?? '',
      travelTimeFlexibility: resumeBooking.travelTimeFlexibility ?? false,
    }));

    // Always dispatch delivery (clears stale address)
    dispatch(setDelivery({
      needHomeDelivery: resumeBooking.needHomeDelivery ?? false,
      ...(resumeBooking.deliveryAddress ? { address: resumeBooking.deliveryAddress } : {}),
    }));

    // Always dispatch passengers (empty array clears stale data from previous booking)
    dispatch(setPassengers(
      (resumeBooking.passengers || []).map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference
          ? (REVERSE_BERTH_MAP[p.berthPreference] as any) || undefined
          : undefined,
        idType: p.idCardType || (p as any).idType || undefined,
        idNumber: p.idCardNumber || (p as any).idNumber || undefined,
      }))
    ));

    // Prepopulate price breakdown from booking pricing
    if (resumeBooking.pricing) {
      dispatch(setPriceBreakdown({
        baseFare: {
          perPassenger: Math.round((resumeBooking.pricing.baseFare || 0) / Math.max(1, resumeBooking.passengers?.length || 1)),
          total: resumeBooking.pricing.baseFare || 0,
        },
        passengerCount: resumeBooking.passengers?.length || 1,
        agentFee: { pct: 0, amount: resumeBooking.pricing.agentFee || 0 },
        platformFee: { pct: 0, amount: resumeBooking.pricing.irctcCharges || 0 },
        gst: { pct: 0, amount: resumeBooking.pricing.gst || 0 },
        deliveryCharge: { amount: resumeBooking.pricing?.deliveryCharge ?? 0 },
        totalAmount: resumeBooking.pricing.totalAmount || 0,
      }));
    } else {
      dispatch(setPriceBreakdown(null));
    }

    // Prepopulate train data from booking so steps can render without needing
    // the separate trains API (Tier 3 can enrich / later override if available)
    if (resumeBooking.travelClass) {
      const trainFromBooking: Train = {
        trainNumber: resumeBooking.trainNumber || '',
        trainName: resumeBooking.trainName || '',
        sourceStationCode: resumeBooking.sourceStationCode || '',
        destinationStationCode: resumeBooking.destinationStationCode || '',
        departureTime: resumeBooking.departureTime || '',
        arrivalTime: resumeBooking.arrivalTime || '',
        class_availability: [{
          travel_class_code: resumeBooking.travelClass || '',
          fare_amount: resumeBooking.pricing?.baseFare || 0,
          is_bookable: true,
          quota_code: 'GN',
          availability_status_text: 'Available',
          availability_display_label: 'Available',
          booking_prediction_percentage: null,
          data_timestamp: new Date().toISOString(),
        }] as CustomClassAvailability[],
      } as Train;

      const classFromBooking: CustomClassAvailability = {
        travel_class_code: resumeBooking.travelClass || '',
        fare_amount: resumeBooking.pricing?.baseFare || 0,
        is_bookable: true,
        quota_code: 'GN',
        availability_status_text: 'Available',
        availability_display_label: 'Available',
        booking_prediction_percentage: null,
        data_timestamp: new Date().toISOString(),
      };

      dispatch(setSelectedTripAndClass({ trip: trainFromBooking, trainClass: classFromBooking }));
    }

    // Prepopulate selected agent if the booking has one assigned
    if (resumeBooking.agentId) {
      dispatch(setSelectedAgent({ id: resumeBooking.agentId } as any));
    }

    // Navigate to the correct step
    dispatch(goToStep(entry.key));
  }, [resumeBooking, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Keep the URL in sync with the current bookingId and stage so that
   * refreshing the page lands on the correct step and doesn't lose the bookingId.
   */
  useEffect(() => {
    const bookingId = draft.bookingId;

    // Prevent stale draft.bookingId from a previous Redux session leaking into
    // the URL on a fresh checkout. Only write bookingId if it was present at
    // mount (genuine resume) or created by this component instance.
    if (!urlBookingId && !sessionCreatedBookingIdRef.current) return;

    if (!bookingId && !urlBookingId) return;
    const stepIdx = BOOKING_STEPS.findIndex((s) => s.key === currentStep);

    const newParams = new URLSearchParams(searchParams);
    newParams.set("bookingId", bookingId || urlBookingId);
    newParams.set("stage", String(stepIdx + 1));

    if (newParams.toString() !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [currentStep, draft.bookingId, urlBookingId, searchParams, setSearchParams]);

  // ── Handlers ──
  const handleFlexibilityChange = (flex: {
    dateFlexibility: boolean;
    trainFlexibility: boolean;
    stationFlexibility: boolean;
    travelTime?: string;
    travelTimeFlexibility?: boolean;
  }) => {
    dispatch(setFlexibility(flex));
    markTouched("preferences");
  };

  const handleDeliveryChange = (delivery: { needHomeDelivery: boolean; address?: UserAddress }) => {
    dispatch(setDelivery(delivery));
    markTouched("delivery");
  };

  const handleAddressUpdate = (address: UserAddress) => {
    updateAddress.mutate(address);
  };

  const handlePriceRefresh = () => {
    if (!selectedTrip || !selectedClass) return;
    markTouched("pricing");
    calculatePrice.mutate({
      baseFare: selectedClass.fare_amount,
      passengerCount: Math.max(1, draft.passengers.length + draft.selectedFamilyMemberIds.length),
      needHomeDelivery: draft.delivery.needHomeDelivery,
    });
  };

  useEffect(() => {
    if (calculatePrice.data) dispatch(setPriceBreakdown(calculatePrice.data));
  }, [calculatePrice.data, dispatch]);

  /**
   * Auto-refresh pricing whenever user enters the pricing step and the
   * passenger count doesn't match what's already in the breakdown.
   * Handles the case where the user goes back from pricing → passengers,
   * changes the count, and returns to pricing.
   */
  useEffect(() => {
    if (currentStep !== "pricing") return;
    if (!selectedClass) return;
    if (calculatePrice.isPending) return;

    const effectiveCount = Math.max(
      1,
      draft.passengers.length + draft.selectedFamilyMemberIds.length,
    );

    const needsRecalc =
      !draft.priceBreakdown ||
      draft.priceBreakdown.passengerCount !== effectiveCount ||
      (draft.delivery.needHomeDelivery && draft.priceBreakdown.deliveryCharge.amount === 0) ||
      (!draft.delivery.needHomeDelivery && draft.priceBreakdown.deliveryCharge.amount > 0);

    if (needsRecalc) {
      dispatch(setPriceBreakdown(null));
      markTouched("pricing");
      calculatePrice.mutate({
        baseFare: selectedClass.fare_amount,
        passengerCount: effectiveCount,
        needHomeDelivery: draft.delivery.needHomeDelivery,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleAgentSelect = (agent: AgentGeolocation) => {
    dispatch(setSelectedAgent(agent));
    markTouched("agent-matching");
  };

  /**
   * handleCreateBooking
   * @description Called when transitioning from preferences → delivery.
   *   If the booking already exists on the server and preferences were not
   *   modified, skip the API call to avoid redundant updates.
   */
  const handleCreateBooking = useCallback(async () => {
    // If booking already exists and preferences weren't touched, skip creation
    if (draft.bookingId && !touchedSteps.current.has("preferences")) {
      dispatch(nextStep());
      return;
    }

    if (!selectedTrip || !selectedClass || !trainNumber) return;

    setIsCreatingBooking(true);
    try {
      const res = await bookingsService.createBooking({
        fromStation: selectedTrip.origin_station_code || selectedTrip.sourceStationCode || "",
        toStation:
          selectedTrip.destination_station_code || selectedTrip.destinationStationCode || "",
        travelDate: date || draft.tripSearchParams?.date || "",
        preferredTrainNumber: selectedTrip.train_identifier_id || selectedTrip.trainNumber || "",
        preferredTravelClass: selectedClass.travel_class_code,
        ticketFare: selectedClass.fare_amount,
        travelTime: draft.flexibility.travelTime,
        travelTimeFlexibility: !!draft.flexibility.travelTimeFlexibility,
        dateFlexibility: !!draft.flexibility.dateFlexibility,
        trainFlexibility: !!draft.flexibility.trainFlexibility,
        stationFlexibility: !!draft.flexibility.stationFlexibility,
        formStage: 2,
      });

      const bookingId = res.data.data.bookingId;
      sessionCreatedBookingIdRef.current = bookingId;
      dispatch(setBookingId(bookingId));
      dispatch(nextStep());
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Booking creation failed");
    } finally {
      setIsCreatingBooking(false);
    }
  }, [
    selectedTrip,
    selectedClass,
    trainNumber,
    draft.flexibility,
    date,
    draft.tripSearchParams?.date,
    draft.bookingId,
    dispatch,
  ]);

  /**
   * handleUpdateDelivery
   * @description Called when transitioning from delivery → passengers.
   *   PATCH-es the booking only if the delivery options were modified.
   *   If pristine, just advance the step.
   */
  const handleUpdateDelivery = useCallback(async () => {
    const bookingId = draft.bookingId;
    if (!bookingId) {
      dispatch(nextStep());
      return;
    }

    // Skip PATCH if delivery was not touched after resume prepopulation
    if (!touchedSteps.current.has("delivery")) {
      dispatch(nextStep());
      return;
    }

    try {
      await updateBooking.mutateAsync({
        bookingId,
        dto: {
          needHomeDelivery: draft.delivery.needHomeDelivery,
          ...(draft.delivery.address ? { deliveryAddress: draft.delivery.address } : {}),
          userLat: userLocation?.lat,
          userLon: userLocation?.lon,
          dateFlexibility: draft.flexibility.dateFlexibility,
          trainFlexibility: draft.flexibility.trainFlexibility,
          stationFlexibility: draft.flexibility.stationFlexibility,
          travelTime: draft.flexibility.travelTime,
          travelTimeFlexibility: !!draft.flexibility.travelTimeFlexibility,
          formStage: 3,
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update delivery");
    }

    dispatch(nextStep());
  }, [draft.bookingId, draft.delivery, userLocation, draft.flexibility, updateBooking, dispatch]);

  /**
   * handleUpdatePassengers
   * @description Called when transitioning from passengers → pricing.
   *   PATCH-es the booking only if passengers were modified.
   *   If pristine, just advance the step.
   */
  const handleUpdatePassengers = useCallback(async () => {
    const bookingId = draft.bookingId;
    if (!bookingId) {
      dispatch(nextStep());
      return;
    }

    // Skip PATCH if passengers were not touched after resume prepopulation
    if (!touchedSteps.current.has("passengers")) {
      dispatch(nextStep());
      return;
    }

    try {
      // Resolve selected family members into passenger-shaped objects
      const familyPassengers = (user?.familyMembers ?? [])
        .filter((fm) => draft.selectedFamilyMemberIds.includes(fm.id))
        .map((fm) => ({
          name: [fm.firstName, fm.lastName].filter(Boolean).join(' '),
          age: fm.age,
          gender: fm.gender,
          berthPreference: undefined as string | undefined,
          idType: undefined as string | undefined,
          idNumber: undefined as string | undefined,
        }));

      // Manual passengers (primary user + additional manually added ones)
      const manualPassengers = draft.passengers.map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference
          ? BERTH_CODE_MAP[p.berthPreference] || p.berthPreference
          : undefined,
        idType: p.idType,
        idNumber: p.idNumber,
      }));

      // Manual first (primary at index 0), then family members
      const allPassengers = [...manualPassengers, ...familyPassengers];

      await updateBooking.mutateAsync({
        bookingId,
        dto: { passengers: allPassengers, formStage: 4 },
      });

      // Sync primary passenger name back to user profile if changed
      const primaryName = draft.passengers[0]?.name;
      if (user && primaryName && primaryName !== user.name) {
        updateProfile.mutate({ name: primaryName });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update passengers");
    }

    dispatch(nextStep());
  }, [draft.bookingId, draft.passengers, draft.selectedFamilyMemberIds, user, updateBooking, updateProfile, dispatch]);

  /**
   * handleAssignAgent
   * @description Called when transitioning from agent-matching → payment.
   *   Assigns the selected agent only if agent selection was modified.
   *   If pristine, just advance.
   */
  const handleAssignAgent = useCallback(async () => {
    const bookingId = draft.bookingId;
    if (!bookingId || !draft.selectedAgent) {
      dispatch(nextStep());
      return;
    }

    // Skip PATCH if agent selection was not touched after resume
    if (!touchedSteps.current.has("agent-matching")) {
      dispatch(nextStep());
      return;
    }

    try {
      await updateBooking.mutateAsync({
        bookingId,
        dto: { agentId: draft.selectedAgent.id, formStage: 6 },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Agent assignment failed");
    }

    dispatch(nextStep());
  }, [draft.bookingId, draft.selectedAgent, updateBooking, dispatch]);

  /**
   * handleUpdatePricing
   * @description Called when transitioning from pricing → agent-matching.
   *   PATCH-es the booking only if the price was refreshed.
   *   If pristine, just advance.
   */
  const handleUpdatePricing = useCallback(async () => {
    const bookingId = draft.bookingId;
    if (!bookingId || !draft.priceBreakdown) {
      dispatch(nextStep());
      return;
    }

    // Skip PATCH if pricing was not refreshed after resume
    if (!touchedSteps.current.has("pricing")) {
      dispatch(nextStep());
      return;
    }

    try {
      await updateBooking.mutateAsync({
        bookingId,
        dto: {
          ticketFare: draft.priceBreakdown.baseFare.total,
          // totalAmount: draft.priceBreakdown.totalAmount,
          formStage: 5,
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update pricing");
    }

    dispatch(nextStep());
  }, [draft.bookingId, draft.priceBreakdown, updateBooking, dispatch]);

  const handlePaymentSuccess = async (paymentData: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) => {
    if (!draft.bookingId) return;

    setIsCreatingBooking(true);
    try {
      // Fetch the booking details and update formStage in parallel
      const [bookingRes] = await Promise.all([
        bookingsService.getBooking(draft.bookingId),
        updateBooking.mutateAsync({
          bookingId: draft.bookingId,
          dto: { formStage: 7 },
        }).catch(() => {}),
      ]);
      const booking = bookingRes.data.data;
      setCreatedBooking(booking);
      dispatch(nextStep());
    } catch (err) {
      console.error("Failed to fetch booking after payment:", err);
    } finally {
      setIsCreatingBooking(false);
    }
  };

  // ── Loading / Error states ──
  const isLoading = !stateTrainData && tier2Enabled && tier2Loading;
  // Only show the error screen when ALL fallback tiers have been exhausted AND
  // there's no existing trip data in Redux AND we're not in resume mode
  // (the resume effect populates draft data from the booking object).
  const hasError = !resolvedTrain && !selectedTrip && !isLoading && !isResumeMode;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (hasError) {
    return <ErrorState message="Train not found. Please go back and try again." />;
  }

  // Email verification guard — must verify before booking
  if (!user?.emailVerified) {
    return (
      <div className="flex items-start justify-center py-12">
        <EmailVerificationPrompt
          title="Verify Email to Book"
          description="You need to verify your email before you can book a ticket."
          onVerified={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Complete your booking</p>
        </div>

        {/* Step Progress */}
        <CheckoutStepper currentStep={currentStep} steps={BOOKING_STEPS} />

        {/* Step Content */}
        <div className="min-h-[300px]">
          {currentStep === "preferences" && (resolvedTrain || draft.selectedTrip) && selectedClass && (
            <PreferencesStep
              train={resolvedTrain || draft.selectedTrip!}
              selectedClass={selectedClass}
              flexibility={draft.flexibility}
              onFlexibilityChange={handleFlexibilityChange}
              onBack={() => navigate(ROUTES.searchTrips)}
              onNext={handleCreateBooking}
            />
          )}

          {currentStep === "delivery" && (
            <DeliveryStep
              delivery={draft.delivery}
              {...(user?.address ? { userAddress: user.address } : {})}
              onDeliveryChange={handleDeliveryChange}
              onAddressUpdate={handleAddressUpdate}
              onBack={() => dispatch(prevStep())}
              onNext={handleUpdateDelivery}
            />
          )}

          {currentStep === "passengers" && user && (
            <PassengerStep
              passengers={draft.passengers}
              familyMembers={user?.familyMembers || []}
              selectedFamilyIds={draft.selectedFamilyMemberIds}
              maxSeats={4}
              user={user}
              onPassengersChange={(p) => {
                dispatch(setPassengers(p));
                markTouched("passengers");
              }}
              onFamilySelectionChange={(ids) => {
                dispatch(setSelectedFamilyMemberIds(ids));
                markTouched("passengers");
              }}
              onBack={() => dispatch(prevStep())}
              onNext={handleUpdatePassengers}
            />
          )}

          {currentStep === "pricing" && (
            <PricingStep
              priceBreakdown={draft.priceBreakdown}
              isCalculating={calculatePrice.isPending}
              onRefreshPrice={handlePriceRefresh}
              onBack={() => dispatch(prevStep())}
              onNext={handleUpdatePricing}
            />
          )}

          {currentStep === "agent-matching" && (
            <AgentMatchingStep
              userLocation={userLocation}
              nearbyAgents={draft.nearbyAgents}
              isSearching={nearbyAgentsQuery.isLoading}
              selectedAgent={draft.selectedAgent}
              onAgentSelect={handleAgentSelect}
              onSearchAgain={() => nearbyAgentsQuery.refetch()}
              onBack={() => dispatch(prevStep())}
              onProceed={handleAssignAgent}
            />
          )}

          {currentStep === "payment" && user && (
            <PaymentStep
              amount={draft.priceBreakdown?.totalAmount || 0}
              bookingId={draft.bookingId || ""}
              user={user}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentFailure={(err) => console.error("Payment failed:", err)}
              onBack={() => dispatch(prevStep())}
              isProcessing={isCreatingBooking}
            />
          )}

          {currentStep === "confirmation" && createdBooking && (
            <ConfirmationStep
              booking={createdBooking}
              onViewBooking={() => navigate(ROUTES.bookingDetail(createdBooking?.bookingId || ""))}
              onNewBooking={() => {
                dispatch(resetDraft());
                navigate(ROUTES.searchTrips);
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
