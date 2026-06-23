/**
 * @file StepBankDetails.tsx
 * @module components/agents/onboarding
 * @description Step 5 of the agent onboarding carousel. Collects bank account details.
 */

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validationRules } from '@/lib/validationRules';

interface BankDetailsData {
  bankAccountNumber: string;
  ifscCode: string;
}

interface StepBankDetailsProps {
  defaultValues?: Partial<BankDetailsData>;
  onSubmit: (data: BankDetailsData) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function StepBankDetails({ defaultValues, onSubmit, onBack, isSubmitting }: StepBankDetailsProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<BankDetailsData>({
    defaultValues: {
      bankAccountNumber: defaultValues?.bankAccountNumber || '',
      ifscCode: defaultValues?.ifscCode || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Bank Details</h3>
        <p className="text-sm text-muted-foreground">Where should we send your earnings?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Account Number *</label>
          <Input {...register('bankAccountNumber', validationRules.default)} placeholder="1234567890" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">IFSC Code *</label>
          <Input {...register('ifscCode', validationRules.default)} placeholder="SBIN0001234" />
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>← Back</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Next →'}
        </Button>
      </div>
    </form>
  );
}
