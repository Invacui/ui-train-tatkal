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
  id: string;
  label: string;
  suffix: string;
  /** dotted path into the config object, e.g. "homeDeliveryCharge.printingCharge" */
  path: string;
}

const FIELDS: FieldDef[] = [
  { id: 'agentChargePercent', label: 'Agent Service Fee', suffix: '%', path: 'agentChargePercent' },
  { id: 'platformFeePercent', label: 'Platform Fee', suffix: '%', path: 'platformFeePercent' },
  { id: 'homeDeliveryPrintingCharge', label: 'Delivery — Printing Charge', suffix: '₹', path: 'homeDeliveryCharge.printingCharge' },
  { id: 'homeDeliveryHandlingCharge', label: 'Delivery — Handling Charge', suffix: '₹', path: 'homeDeliveryCharge.handlingCharge' },
  { id: 'gstPercent', label: 'GST', suffix: '%', path: 'gstPercent' },
];

/**
 * Read a value from the PricingConfig (or intermediate form state) via a dotted path.
 * e.g. "homeDeliveryCharge.printingCharge" → config.homeDeliveryCharge?.printingCharge
 */
function getNestedValue(obj: Record<string, any> | undefined, path: string): number | undefined {
  if (!obj) return undefined;
  const parts = path.split('.');
  let val: any = obj;
  for (const part of parts) {
    if (val == null || typeof val !== 'object') return undefined;
    val = val[part];
  }
  return typeof val === 'number' ? val : undefined;
}

/**
 * Rebuild a partial PricingConfigUpdateDto from the flat form entries.
 * Nested paths (e.g. "homeDeliveryCharge.printingCharge") are reassembled into
 * the nested object structure the API expects.
 */
function buildDto(
  form: Record<string, string>,
  fields: FieldDef[],
  existing: PricingConfig | undefined,
): PricingConfigUpdateDto {
  const dto: Record<string, any> = {};
  const homeDelivery: Record<string, number> = {};

  for (const field of fields) {
    const raw = form[field.id];
    const value = raw !== undefined && raw !== '' ? parseFloat(raw) : undefined;

    if (value === undefined || isNaN(value)) continue;

    if (field.path.startsWith('homeDeliveryCharge.')) {
      const subKey = field.path.split('.')[1];
      homeDelivery[subKey] = value;
    } else {
      dto[field.path] = value;
    }
  }

  if (Object.keys(homeDelivery).length > 0) {
    dto.homeDeliveryCharge = {
      ...(existing?.homeDeliveryCharge ?? {}),
      ...homeDelivery,
    };
  }

  return dto as PricingConfigUpdateDto;
}

/**
 * AdminPricingConfig
 * @description Displays all pricing configuration fields in an editable form.
 *   Each field shows its current value with currency/percentage suffix.
 *   Nested fields (homeDeliveryCharge) are flattened for editing and rebuilt
 *   into the nested structure on submit.
 */
export function AdminPricingConfig({ config, isLoading, onSave, isSaving }: AdminPricingConfigProps) {
  const [form, setForm] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(buildDto(form, FIELDS, config));
  };

  const set = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const getValue = (field: FieldDef): string => {
    if (form[field.id] !== undefined) return form[field.id];
    const val = getNestedValue(config as unknown as Record<string, any>, field.path);
    return val !== undefined ? String(val) : '';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Pricing Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
              <div key={field.id} className="space-y-1">
                <Label htmlFor={field.id}>{field.label}</Label>
                <div className="relative">
                  <Input
                    id={field.id}
                    type="number"
                    step="any"
                    min="0"
                    value={getValue(field)}
                    onChange={(e) => set(field.id, e.target.value)}
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
