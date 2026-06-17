/**
 * @file Agent onboarding page
 * @module routes/agent/Onboard
 * @description Agent registration form collecting business details, bank info,
 *   and certification status for manual review and approval.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Custom hook for agent onboarding mutation
import { useAgentOnboard } from '@/hooks/agents/useAgentOnboard';

// Validation rules for form fields
import { validationRules } from '@/lib/validationRules';

// Toast notification for success feedback
import { toast } from 'sonner';

/**
 * AgentOnboard (page component)
 * @description Renders the agent registration form with fields for business
 *   name, PAN, GST, city, daily capacity, bank details, and certification.
 *   Submits the application for admin review.
 */
export default function AgentOnboard() {
  const { mutate, isPending } = useAgentOnboard();
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Agent Onboarding" description="Register as a railway booking agent" />
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit((v) => mutate(v as any, {
              onSuccess: () => toast.success('Onboarding submitted for review'),
            }))} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Name</label>
                  <Input {...register('businessName', validationRules.agencyName)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">PAN Number</label>
                  <Input {...register('panNumber', validationRules.default)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GST Number</label>
                  <Input {...register('gstNumber')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input {...register('city', validationRules.default)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Daily Capacity</label>
                  <Input type="number" {...register('dailyCapacity')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Account Number</label>
                  <Input {...register('bankAccountNumber', validationRules.default)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">IFSC Code</label>
                  <Input {...register('ifscCode', validationRules.default)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <Input {...register('address', validationRules.default)} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('isRailwayCertified')} />
                <span className="text-sm">Railway certified agent</span>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Submitting…' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
