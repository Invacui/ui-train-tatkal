/**
 * @file DeliveryStep.tsx
 * @description Step 2: Shows the user's saved address as a chip and asks whether
 *   they want home delivery. If no address is saved, prompts them to add one.
 * @module components/checkout
 */

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAddressForm } from '@/components/profile/UserAddressForm';
import { ArrowLeft, ArrowRight, MapPin, Home, CheckCircle2 } from 'lucide-react';

import type { UserAddress } from '@/types/auth.types';
import type { DeliveryChoice } from '@/store/booking-draft.slice';

interface DeliveryStepProps {
  delivery: DeliveryChoice;
  userAddress?: UserAddress;
  onDeliveryChange: (delivery: DeliveryChoice) => void;
  onAddressUpdate: (address: UserAddress) => void;
  onBack: () => void;
  onNext: () => void;
}

/**
 * DeliveryStep
 * @description Shows the user's saved address (if any) as a readable chip at the
 *   top. Below it, a toggle asks whether they want home delivery. If they toggle
 *   ON and have no address yet, the address form is revealed.
 */
export function DeliveryStep({
  delivery,
  userAddress,
  onDeliveryChange,
  onAddressUpdate,
  onBack,
  onNext,
}: DeliveryStepProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [hasCheckedAddress, setHasCheckedAddress] = useState(!!delivery.address || !!userAddress);

  const handleDeliveryToggle = (value: boolean) => {
    onDeliveryChange({ ...delivery, needHomeDelivery: value });
  };

  const handleAddressSave = (address: UserAddress) => {
    onAddressUpdate(address);
    onDeliveryChange({ ...delivery, address, needHomeDelivery: true });
    setShowAddressForm(false);
    setHasCheckedAddress(true);
  };

  const currentAddress = delivery.address || userAddress;

  return (
    <div className="space-y-6">
      {/* Saved Address Chip */}
      {currentAddress && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Your Address</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-base">{currentAddress.line1}</p>
                  {currentAddress.line2 && (
                    <p className="text-sm text-muted-foreground">{currentAddress.line2}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {currentAddress.city}, {currentAddress.state} — {currentAddress.pincode}
                  </p>
                  {currentAddress.lat && currentAddress.lon && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {currentAddress.lat.toFixed(4)}, Lon: {currentAddress.lon.toFixed(4)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="link"
              size="sm"
              className="mt-2 h-auto p-0 text-xs"
              onClick={() => setShowAddressForm(true)}>
              Edit address
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delivery Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home Delivery</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get your tickets printed and delivered to your doorstep (additional charges apply).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="home-delivery" className="font-medium cursor-pointer">
                  I want home delivery
                </Label>
                <p className="text-xs text-muted-foreground">
                  {currentAddress
                    ? "Deliver to the address above"
                    : "You'll need to add a delivery address first"}
                </p>
              </div>
            </div>
            <Switch
              id="home-delivery"
              checked={delivery.needHomeDelivery}
              onCheckedChange={handleDeliveryToggle}
            />
          </div>

          {/* Address form shown when:
              1. No saved address and delivery is toggled ON → need to add one
              2. User clicked "Edit address" */}
          {delivery.needHomeDelivery && !currentAddress && !showAddressForm && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              You don't have a saved address yet. Please add one to use home delivery.
            </div>
          )}

          {delivery.needHomeDelivery && !currentAddress && !showAddressForm && (
            <Button onClick={() => setShowAddressForm(true)} className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          )}

          {/* Address edit / add form */}
          {showAddressForm && (
            <div className="border-t pt-4">
              <UserAddressForm
                address={currentAddress}
                onSave={handleAddressSave}
                onCancel={() => setShowAddressForm(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <Button onClick={onNext}>
          Continue <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
