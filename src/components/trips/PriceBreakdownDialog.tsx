/**
 * @file Price Breakdown Dialog
 * @module components/trips/PriceBreakdownDialog
 * @description Dialog showing a detailed price breakdown for a selected train
 *   class. Fetches the latest pricing config from GET /pricing/config and
 *   stores it locally for all fare calculations. Supports adjusting passenger
 *   count with +/- controls, home-delivery toggle, and per-passenger
 *   breakdown.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Train,
  IndianRupee,
  ShieldCheck,
  Building,
  Home,
  Percent,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { usePricingConfig } from "@/hooks/pricing/usePricingConfig";
import { DEFAULT_PRICING_CONFIG } from "@/constants/pricing.constant";
import type { CustomClassAvailability, Train as TrainType } from "@/types/trips.types";
import type { PricingConfig } from "@/types/pricing.types";

interface PriceBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cls: CustomClassAvailability;
  trainName: string;
  trainNumber: string;
  isDeparted?: boolean;
  train?: TrainType;
  source?: string;
  destination?: string;
  date?: string;
}

/** Per-passenger maximum for the +/- stepper */
const MAX_PASSENGERS = 6;
const MIN_PASSENGERS = 1;

/**
 * PriceBreakdownDialog
 * @description Modal showing a detailed fare breakdown for the selected class.
 *   Pricing percentages and charges are fetched from GET /pricing/config
 *   (cached via React Query at the TripResults level) with fallback to
 *   DEFAULT_PRICING_CONFIG. Adjusting passenger count recalculates all line
 *   items in real time.
 *   "Proceed to Book" navigates to the booking page with train data in state.
 */
export function PriceBreakdownDialog({
  open,
  onOpenChange,
  cls,
  trainName,
  trainNumber,
  isDeparted,
  train,
  source,
  destination,
  date,
}: PriceBreakdownDialogProps) {
  const navigate = useNavigate();
  const [includeDelivery, setIncludeDelivery] = useState(false);
  const [passengerCount, setPassengerCount] = useState(1);

  // ── Pricing config: fetched from API, stored locally ──
  const { data: apiConfig } = usePricingConfig();
  // Keep a local copy so the dialog always has the config even if the
  // query cache is invalidated while the modal is open.
  const [config, setConfig] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG);

  useEffect(() => {
    if (apiConfig) {
      setConfig(apiConfig);
    }
  }, [apiConfig]);

  // ── Compute totals ──
  const baseFarePerPass = cls.fare_amount;
  const totalBaseFare = baseFarePerPass * passengerCount;

  const agentFeePct = config.agentChargePercent / 100;
  const platformFeePct = config.platformFeePercent / 100;
  const gstPct = config.gstPercent / 100;

  // Percentage fees on total base fare
  const agentFee = Math.round(totalBaseFare * agentFeePct);
  const platformFee = Math.round(totalBaseFare * platformFeePct);

  // Delivery: printingCharge + handlingCharge (flat, not per-passenger)
  const { printingCharge = 0, handlingCharge = 0 } = config.homeDeliveryCharge ?? {};
  const homeDeliveryTotal = printingCharge + handlingCharge;
  const homeDlv = includeDelivery ? homeDeliveryTotal : 0;

  // Subtotal & GST
  const subtotal = agentFee + platformFee + homeDlv;
  const gstAmount = Math.round(subtotal * gstPct);
  const total = subtotal + gstAmount + totalBaseFare;

  // ── Tatkal premium (applies only to TQ quota) ──
  const isTatkal = cls.quota_code === "TQ";

  // ── Build line items ──
  // (order determines both the list order and the bar-segment order)
  const items: { label: string; value: number; icon: React.ElementType; color: string }[] = [
    {
      label: `Base Fare × ${passengerCount}`,
      value: totalBaseFare,
      icon: IndianRupee,
      color: "bg-blue-500",
    },
    {
      label: "Agent Fee",
      value: agentFee,
      icon: ShieldCheck,
      color: "bg-violet-500",
    },
    {
      label: "Platform Fee",
      value: platformFee,
      icon: Building,
      color: "bg-amber-500",
    },
  ];

  if (isTatkal) {
    items.push({
      label: "Tatkal Quota",
      value: 0,
      icon: Train,
      color: "bg-orange-500",
    });
  }

  if (includeDelivery) {
    items.push({
      label: "Home Delivery",
      value: homeDlv,
      icon: Home,
      color: "bg-emerald-500",
    });
  }

  // GST line
  if (gstAmount > 0) {
    items.push({
      label: "GST",
      value: gstAmount,
      icon: Percent,
      color: "bg-cyan-500",
    });
  }

  // ── Passenger stepper helpers ──
  const canDecrement = passengerCount > MIN_PASSENGERS;
  const canIncrement = passengerCount < MAX_PASSENGERS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Train className="h-5 w-5 text-primary" />
            <span>Price Breakdown</span>
          </DialogTitle>
          <DialogDescription>
            {trainName} · <span className="font-mono">{trainNumber}</span> ·{" "}
            <Badge variant="outline" className="inline font-mono text-xs">
              {cls.travel_class_code}
              {isTatkal ? " Tatkal" : ""}
            </Badge>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ── Passenger count stepper ── */}
          <div className="rounded-lg border border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-muted-foreground" />
                Passengers
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canDecrement}
                  onClick={() => setPassengerCount((p) => Math.max(MIN_PASSENGERS, p - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="min-w-[2ch] text-center text-lg font-bold tabular-nums">
                  {passengerCount}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!canIncrement}
                  onClick={() => setPassengerCount((p) => Math.min(MAX_PASSENGERS, p + 1))}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCurrency(baseFarePerPass)} per passenger
            </p>
          </div>

          {/* ── Visual percentage bar ── */}
          {total > 0 && (
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {items.map((item) => (
                <div
                  key={item.label}
                  className={cn("h-full transition-all", item.color)}
                  style={{ width: `${(item.value / total) * 100}%` }}
                  title={`${item.label}: ${formatCurrency(item.value)}`}
                />
              ))}
            </div>
          )}

          {/* ── Line items ── */}
          <div className="space-y-2">
            {/* Per-passenger info row */}
            <div className="flex items-center justify-between rounded-lg bg-blue-50/50 px-3 py-2 text-xs text-muted-foreground dark:bg-blue-950/20">
              <span>Base fare per passenger</span>
              <span className="font-medium">{formatCurrency(baseFarePerPass)}</span>
            </div>

            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
                <span className="font-semibold text-foreground">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>

          {/* ── Optional delivery toggle ── */}
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor="home-delivery"
                className="flex items-center gap-2 text-sm font-medium">
                <Home className="h-4 w-4 text-muted-foreground" />
                Home Delivery
              </Label>
              <span className="text-xs text-muted-foreground">
                {formatCurrency(homeDeliveryTotal)} — Ticket delivered to your address
              </span>
            </div>
            <Switch
              id="home-delivery"
              checked={includeDelivery}
              onCheckedChange={setIncludeDelivery}
            />
          </div>

          {/* ── Divider ── */}
          <hr className="border-border" />

          {/* ── Total ── */}
          <div className="flex items-center justify-between px-1">
            <span className="flex items-center gap-2 text-base font-semibold">
              <IndianRupee className="h-4 w-4 text-primary" />
              Total
            </span>

            <span className="text-xs text-muted-foreground">
              <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>{" "}
              (incl. GST)
            </span>
          </div>

          {/* ── Per-passenger total hint ── */}
          {passengerCount > 1 && (
            <p className="text-center text-xs text-muted-foreground">
              {formatCurrency(Math.round(total / passengerCount))} per passenger
            </p>
          )}

          {/* ── Departed notice ── */}
          {isDeparted && (
            <p className="text-center text-xs text-red-500 font-medium">
              This train has already departed and cannot be booked.
            </p>
          )}

          {/* ── Booking button ── */}
          <Button
            className="w-full gap-2"
            disabled={isDeparted}
            onClick={() => {
              onOpenChange(false);
              if (trainNumber && train) {
                const params = new URLSearchParams();
                if (source) params.set("source", source);
                if (destination) params.set("destination", destination);
                if (date) params.set("date", date);
                const qs = params.toString();
                navigate(`${ROUTES.booking(trainNumber)}${qs ? `?${qs}` : ""}`, {
                  state: { trainData: train },
                });
              } else if (trainNumber) {
                navigate(ROUTES.booking(trainNumber));
              }
            }}>
            <ShieldCheck className="h-4 w-4" />
            Proceed to Book — {formatCurrency(total)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
