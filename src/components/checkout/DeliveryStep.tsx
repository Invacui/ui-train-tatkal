/**
 * @file DeliveryStep.tsx
 * @description Step 2: Allows the user to choose home delivery and manage their delivery address.
 * @module components/checkout
 */

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAddressForm } from '@/components/profile/UserAddressForm';
import { ArrowLeft, ArrowRight, MapPin, Home } from 'lucide-react';

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
 * @description Lets the user toggle home delivery on/off. When enabled, shows the
 *   saved address or prompts the user to add one via UserAddressForm.
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

  const handleDeliveryToggle = (value: boolean) => {
    onDeliveryChange({ ...delivery, needHomeDelivery: value });
  };

  const handleAddressSave = (address: UserAddress) => {
    onAddressUpdate(address);
    onDeliveryChange({ ...delivery, address, needHomeDelivery: true });
    setShowAddressForm(false);
  };

  const currentAddress = delivery.address || userAddress;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home Delivery</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get your tickets delivered to your doorstep (additional charges apply).
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="home-delivery" className="font-medium">Home Delivery</Label>
                <p className="text-xs text-muted-foreground">
                  Ticket will be printed and delivered to your address
                </p>
              </div>
            </div>
            <Switch
              id="home-delivery"
              checked={delivery.needHomeDelivery}
              onCheckedChange={handleDeliveryToggle}
            />
          </div>
        </CardContent>
      </Card>

      {delivery.needHomeDelivery && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            {currentAddress && !showAddressForm ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 border rounded-md">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{currentAddress.line1}</p>
                    {currentAddress.line2 && (
                      <p className="text-sm text-muted-foreground">{currentAddress.line2}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {currentAddress.city}, {currentAddress.state} — {currentAddress.pincode}
                    </p>
                    {currentAddress.lat && currentAddress.lon && (
                      <p className="text-xs text-muted-foreground">
                        Lat: {currentAddress.lat.toFixed(4)}, Lon: {currentAddress.lon.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}>
                  Update Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  You haven&apos;t set a delivery address yet. Please add one to continue.
                </p>
                {showAddressForm ? (
                  <UserAddressForm
                    address={currentAddress}
                    onSave={handleAddressSave}
                    onCancel={() => setShowAddressForm(false)}
                  />
                ) : (
                  <Button onClick={() => setShowAddressForm(true)}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
