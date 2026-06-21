/**
 * @file AdminPricingConfig.tsx
 * @description Admin form to update the pricing configuration (fees, charges, percentages).
 * @module components/admin
 */

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Save, Loader2 } from 'lucide-react';

import type { PricingConfig, PricingConfigUpdateDto } from '@/types/pricing.types';

interface AdminPricingConfigProps {
  config: PricingConfig | undefined;
  isLoading: boolean;
  onSave: (dto: PricingConfigUpdateDto) => void;
  isSaving: boolean;
}

interface FieldDef {
  key: keyof PricingConfigUpdateDto;
  label: string;
  suffix: string;
}

const FIELDS: FieldDef[] = [
  { key: 'brokeragePercent', label: 'Brokerage Charge', suffix: '%' },
  { key: 'agentChargePercent', label: 'Agent Service Fee', suffix: '%' },
  { key: 'baseFixedCharge', label: 'Base Fixed Charge', suffix: '₹' },
  { key: 'flatChargePerBooking', label: 'Flat Charge Per Booking', suffix: '₹' },
  { key: 'perKmCharge', label: 'Per KM Distance Charge', suffix: '₹' },
  { key: 'platformCharge', label: 'Platform Charge', suffix: '₹' },
  { key: 'homeDeliveryCharge', label: 'Home Delivery Charge', suffix: '₹' },
  { key: 'printingCharge', label: 'Printing Charge', suffix: '₹' },
  { key: 'tatkalPremiumPercent', label: 'Tatkal Premium', suffix: '%' },
  { key: 'convenienceFeePercent', label: 'Convenience Fee', suffix: '%' },
  { key: 'gstPercent', label: 'GST', suffix: '%' },
];

/**
 * AdminPricingConfig
 * @description Displays all pricing configuration fields in an editable form.
 *   Each field shows its current value with currency/percentage suffix.
 */
export function AdminPricingConfig({ config, isLoading, onSave, isSaving }: AdminPricingConfigProps) {
  const [form, setForm] = useState<PricingConfigUpdateDto>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (key: keyof PricingConfigUpdateDto, value: string) => {
    const num = parseFloat(value);
    setForm((prev) => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
  };

  const getValue = (key: keyof PricingConfigUpdateDto): string => {
    if (form[key] !== undefined) return String(form[key]);
    if (config && key in config) return String((config as any)[key] ?? '');
    return '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Pricing Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pricing Configuration</CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure all fee rates and charges. Values take effect immediately.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map((field) => (
              <div key={field.key} className="space-y-1">
                <Label htmlFor={field.key}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.key}
                    type="number"
                    step="any"
                    min="0"
                    value={getValue(field.key)}
                    onChange={(e) => set(field.key, e.target.value)}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    {field.suffix}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving || Object.keys(form).length === 0}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Configuration
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
