/**
 * @file PassengerStep.tsx
 * @description Step 3: Combined passenger entry — the logged-in user is always
 *   present as the first (non-deletable) passenger. Users can select from saved
 *   family members OR enter additional passengers manually.
 * @module components/checkout
 */

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FamilyMemberSelector } from "@/components/checkout/FamilyMemberSelector";
import { PassengerForm } from "@/components/passengers/PassengerForm";
import { ArrowLeft, ArrowRight, UserPlus, AlertTriangle } from "lucide-react";

import type { PassengerDetailsFormValues } from "@/lib/validationRules";
import type { FamilyMember, User } from "@/types/auth.types";

interface PassengerStepProps {
  /** Manual passenger entries (not from family) — index 0 is always the primary user */
  passengers: PassengerDetailsFormValues[];
  familyMembers: FamilyMember[];
  selectedFamilyIds: string[];
  maxSeats: number;
  /** The currently logged-in user */
  user: User;
  onPassengersChange: (passengers: PassengerDetailsFormValues[]) => void;
  onFamilySelectionChange: (ids: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const EMPTY_PASSENGER: PassengerDetailsFormValues = {
  name: "",
  age: "" as unknown as number,
  gender: "male",
};

/**
 * PassengerStep
 * @description Lets the user add passengers. The first slot is always the
 *   logged-in user (non-deletable, name pre-filled). Additional passengers
 *   can be added from family members or filled in manually.
 */
export function PassengerStep({
  passengers,
  familyMembers,
  selectedFamilyIds,
  maxSeats,
  user,
  onPassengersChange,
  onFamilySelectionChange,
  onBack,
  onNext,
}: PassengerStepProps) {
  // Ensure the primary passenger (index 0) is pre-filled with the user's name
  useEffect(() => {
    if (passengers.length === 0 || passengers[0]?.name !== user.name) {
      const primary: PassengerDetailsFormValues = {
        name: user.name,
        age: passengers[0]?.age ?? ("" as unknown as number),
        gender: passengers[0]?.gender ?? "male",
        ...(passengers[0]?.berthPreference ? { berthPreference: passengers[0].berthPreference } : {}),
      };
      // Preserve any manual passengers beyond index 0
      const rest = passengers.length > 0 ? passengers.slice(1) : [];
      onPassengersChange([primary, ...rest]);
    }
  }, []); // Run only on mount

  const isPrimaryNameChanged =
    passengers[0] && passengers[0].name !== user.name;

  const additionalPassengers = passengers.slice(1);
  const totalPassengers = selectedFamilyIds.length + additionalPassengers.length + 1; // +1 for the primary user
  const canProceed = totalPassengers <= maxSeats;

  const handleAddManual = () => {
    onPassengersChange([...passengers, { ...EMPTY_PASSENGER }]);
  };

  const handlePassengerChange = (index: number, values: PassengerDetailsFormValues) => {
    // Index 0 is the primary user; indexes passed in from PassengerForm are 0-based
    const actualIndex = index; // PassengerForm sends 0-based index into our array
    const updated = [...passengers];
    updated[actualIndex] = values;
    onPassengersChange(updated);
  };

  const handleRemoveManual = (index: number) => {
    // Never allow removing the primary passenger (index 0)
    if (index === 0) return;
    onPassengersChange(passengers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Passengers</CardTitle>
          <p className="text-sm text-muted-foreground">
            Add passengers for this booking ({totalPassengers} of {maxSeats} seats filled).
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Primary passenger — the logged-in user, always present */}
          <div className="rounded-lg border border-primary/40 p-4 bg-primary/5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-medium flex items-center gap-2">
                You (Primary Passenger)
              </h4>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                Non-deletable
              </span>
            </div>

            {/* Aadhaar name warning */}
            {isPrimaryNameChanged && (
              <div className="flex items-start gap-2 mb-3 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-xs">
                  You have changed your name. Please make sure it matches the name on your
                  Aadhaar card exactly, otherwise your ticket may be invalid for travel.
                </p>
              </div>
            )}

            <PassengerForm
              index={0}
              values={passengers[0] || { name: user.name, age: "" as unknown as number, gender: "male" }}
              onChange={handlePassengerChange}
              onRemove={() => {}} // no-op — cannot delete primary
            />
          </div>

          {/* Family member selection */}
          {familyMembers.length > 0 && (
            <FamilyMemberSelector
              familyMembers={familyMembers}
              selectedIds={selectedFamilyIds}
              maxSeats={maxSeats}
              onSelectionChange={onFamilySelectionChange}
              onAddNew={handleAddManual}
            />
          )}

          {/* Additional manual passenger form rows */}
          {additionalPassengers.map((p, idx) => {
            const actualIndex = idx + 1; // real index in the passengers array
            return (
              <div key={actualIndex} className="border rounded-md p-3">
                <PassengerForm
                  index={actualIndex}
                  values={p}
                  onChange={handlePassengerChange}
                  onRemove={handleRemoveManual}
                />
              </div>
            );
          })}

          {/* Add manual passenger button */}
          {totalPassengers < maxSeats && (
            <Button variant="outline" size="sm" onClick={handleAddManual} className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Another Passenger
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
