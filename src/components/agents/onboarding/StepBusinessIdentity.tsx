/**
 * @file StepBusinessIdentity.tsx
 * @module components/agents/onboarding
 * @description Step 1 of the agent onboarding carousel. Collects business identity info.
 */

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validationRules } from '@/lib/validationRules';

interface BusinessIdentityData {
  businessName: string;
  panNumber: string;
  gstNumber: string;
  businessEmail?: string;
  businessPhone?: string;
}

interface StepBusinessIdentityProps {
  defaultValues?: Partial<BusinessIdentityData>;
  onSubmit: (data: BusinessIdentityData) => void;
  isSubmitting?: boolean;
}

export function StepBusinessIdentity({ defaultValues, onSubmit, isSubmitting }: StepBusinessIdentityProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BusinessIdentityData>({
    defaultValues: {
      businessName: defaultValues?.businessName || '',
      panNumber: defaultValues?.panNumber || '',
      gstNumber: defaultValues?.gstNumber || '',
      businessEmail: defaultValues?.businessEmail || '',
      businessPhone: defaultValues?.businessPhone || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Business Identity</h3>
        <p className="text-sm text-muted-foreground">Tell us about your business</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Name *</label>
          <Input {...register('businessName', validationRules.agencyName)} placeholder="Amit Travels" />
          {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">PAN Number *</label>
          <Input {...register('panNumber', validationRules.default)} placeholder="ABCDE1234F" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">GST Number *</label>
          <Input {...register('gstNumber')} placeholder="22AAAAA0000A1Z5" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Email</label>
          <Input type="email" {...register('businessEmail')} placeholder="business@example.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Phone</label>
          <Input type="tel" {...register('businessPhone')} placeholder="9876543210" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Next →'}
        </Button>
      </div>
    </form>
  );
}
