/**
 * @file Checkout page
 * @module routes/dashboard/Checkout
 * @description Full multi-step checkout flow (7 steps):
 *   preferences → delivery → passengers → pricing → agent-matching → payment → confirmation
 *
 * Train data resolution (3-tier priority):
 *   Tier 1 — router state (location.state.trainData) — passed from TripCard/TripDetail
 *   Tier 2 — /trains/search filtered by train_identifier_id — sourced from URL query params
 *   Tier 3 — /trains/{id} direct endpoint — final fallback, merged with Tier 2 data if partial
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
import { useTrainDetail } from "@/hooks/trips/useTrainDetail";
import { useCalculatePrice } from "@/hooks/bookings/useCalculatePrice";
import { useNearbyAgents } from "@/hooks/agents/useNearbyAgents";
import { useUpdateAddress } from "@/hooks/profile/useUpdateAddress";
import { useUpdateBooking } from "@/hooks/bookings/useUpdateBooking";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { toast } from "sonner";
import { bookingsService } from "@/services/bookings.service";

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
 * Merge/union two Train-like objects, with `overrides` taking precedence for every field.
 * This ensures Tier 3's fields fill gaps when Tier 2 only has search-level data.
 */
function unionMerge(base: Partial<Train>, overrides: Partial<Train>): Train {
  return { ...base, ...overrides } as Train;
}

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
 *   Resolves train data via 3-tier priority chain:
 *   1. Router state (preferred)
 *   2. Search API + filter
 *   3. Direct train endpoint (fallback)
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

  // ── Tier 2: Search API (enabled only when NOT in resume mode) ──
  const tier2Enabled = !stateTrainData && !isResumeMode && !!source && !!destination && !!date && !!trainNumber;
  const { data: searchResults, isLoading: tier2Loading } = useTripSearch(
    { source, destination, date },
    tier2Enabled
  );

  // ── Tier 3: Direct train endpoint (enabled only when Tier 1 is null AND Tier 2 is not loading AND hasn't resolved) ──
  const tier3Enabled = !stateTrainData && !tier2Enabled && !!trainNumber;
  const { data: directTrain, isLoading: tier3Loading } = useTrainDetail(
    tier3Enabled ? trainNumber : ""
  );

  // ── Resolve train data: Tier 1 → Tier 2 → Tier 3 ──
  const resolvedTrain: Train | null = useMemo(() => {
    // Tier 1
    if (stateTrainData) return normaliseTrain(stateTrainData);

    // Tier 2: find in search results
    if (searchResults && trainNumber) {
      const found = searchResults.find(
        (t: Train) => (t.train_identifier_id || t.trainNumber) === trainNumber
      );
      if (found) return normaliseTrain(found);
    }

    // Tier 3: direct endpoint, merge with any partial search data
    if (directTrain) {
      const tier3 = normaliseTrain(directTrain);
      if (searchResults && trainNumber) {
        // Union merge: Tier 2 (search) has fresher class_availability,
        // Tier 3 (detail) has fuller train metadata
        const partialSearch = searchResults.find(
          (t: Train) => (t.train_identifier_id || t.trainNumber) === trainNumber
        );
        if (partialSearch && tier3) {
          return unionMerge(tier3, partialSearch);
        }
      }
      return tier3;
    }

    return null;
  }, [stateTrainData, searchResults, directTrain, trainNumber]);

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
  // In resume mode, only set train/class — don't auto-advance (the resume effect handles step).
  useEffect(() => {
    if (resolvedTrain && !selectedTrip && resolvedTrain.class_availability?.length) {
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
  }, [resolvedTrain, selectedTrip, dispatch, selectedClassCode]);

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

  // ── Resume existing booking ──
  /** bookingId we're resuming — from URL (BookingCard) or Redux draft (in-session refresh) */
  const resumeBookingId: string = urlBookingId || (draft.bookingId ?? "");
  const { data: resumeBooking } = useBooking(resumeBookingId);

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
        baseFare: resumeBooking.pricing.baseFare || 0,
        perPassengerFare: 0,
        passengerCount: resumeBooking.passengers?.length || 1,
        irctcCharges: resumeBooking.pricing.irctcCharges || 0,
        tatkalCharges: 0,
        convenienceFee: resumeBooking.pricing.convenienceFee || 0,
        gst: resumeBooking.pricing.gst || 0,
        agentFee: resumeBooking.pricing.agentFee || 0,
        brokerageFee: 0,
        distanceCharge: 0,
        perKmCharge: 0,
        estimatedDistance: 0,
        platformCharge: resumeBooking.pricing.irctcCharges || 0,
        homeDeliveryCharge: 0,
        printingCharge: 0,
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
    });
  };

  useEffect(() => {
    if (calculatePrice.data) dispatch(setPriceBreakdown(calculatePrice.data));
  }, [calculatePrice.data, dispatch]);

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
      const passengers = draft.passengers.map((p) => ({
        name: p.name,
        age: p.age,
        gender: p.gender,
        berthPreference: p.berthPreference
          ? BERTH_CODE_MAP[p.berthPreference] || p.berthPreference
          : undefined,
        idType: p.idType,
        idNumber: p.idNumber,
      }));

      await updateBooking.mutateAsync({
        bookingId,
        dto: { passengers, formStage: 4 },
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
  }, [draft.bookingId, draft.passengers, user, updateBooking, updateProfile, dispatch]);

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
          ticketFare: draft.priceBreakdown.baseFare,
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
  const isLoading = !stateTrainData && (tier2Enabled ? tier2Loading : tier3Loading);
  const hasError = !resolvedTrain && !isLoading;

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
