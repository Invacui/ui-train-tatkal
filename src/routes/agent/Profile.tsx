/**
 * @file Agent profile page
 * @module routes/agent/Profile
 * @description View and edit agent profile page. Fetches profile via
 *   useAgentProfile and saves via useUpdateAgentProfile.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Page header component
import { PageHeader } from '@/components/common/PageHeader';

// Error state component
import { ErrorState } from '@/components/common/ErrorState';

// Custom hooks
import { useAgentProfile } from '@/hooks/agents/useAgentProfile';
import { useUpdateAgentProfile } from '@/hooks/agents/useUpdateAgentProfile';

// Toast notifications
import { toast } from 'sonner';

// Validation rules
import { validationRules } from '@/lib/validationRules';

// Geolocation components
import { AgentGeolocationForm } from '@/components/agents/AgentGeolocationForm';
import { useUpdateAgentLocation } from '@/hooks/agents/useUpdateAgentLocation';

// Icons
import { MapPin, AlertTriangle } from 'lucide-react';

/**
 * AgentProfile (page component)
 * @description Displays the agent's profile with view/edit toggle.
 *   Shows business details, status badge, tier, rating, and bank info.
 */
export default function AgentProfile() {
  const { data: profile, isLoading, error } = useAgentProfile();
  const { mutate: updateProfile, isPending } = useUpdateAgentProfile();
  const { mutate: updateLocation, isPending: isLocationSaving } = useUpdateAgentLocation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    values: profile ? {
      businessName: profile.businessName || '',
      addressLine1: profile.address?.line1 || '',
      addressLine2: profile.address?.line2 || '',
      state: profile.address?.state || '',
      pincode: profile.address?.pincode || '',
      city: profile.city || '',
      panNumber: profile.panNumber || '',
      gstNumber: profile.gstNumber || '',
      dailyCapacity: profile.dailyCapacity || 0,
      bankAccountNumber: profile.bankAccountNumber || '',
      ifscCode: profile.ifscCode || '',
    } : undefined,
  });

  const onSubmit = (data: any) => {
    const payload: Record<string, unknown> = {
      ...data,
      address: {
        line1: data.addressLine1,
        line2: data.addressLine2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
    };
    delete payload.addressLine1;
    delete payload.addressLine2;
    updateProfile(payload, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
    });
  };

  if (error) return <ErrorState message="Failed to load profile" />;

  const statusColor = profile?.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
    : profile?.status === 'suspended' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200';

  const tierColor = profile?.tier === 'gold' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
    : profile?.tier === 'silver' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200';

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Agent Profile" description="View and edit your profile information" />

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : profile ? (
          <>
            {/* Status & Tier badges */}
            <div className="flex flex-wrap gap-3">
              <Badge className={statusColor}>
                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
              </Badge>
              <Badge className={tierColor}>
                {profile.tier.charAt(0).toUpperCase() + profile.tier.slice(1)}
              </Badge>
              <Badge variant="outline">
                Rating: {profile.rating.toFixed(1)}
              </Badge>
              <Badge variant="outline" className={profile.isOnline ? 'text-green-600' : 'text-muted-foreground'}>
                {profile.isOnline ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* Business Details Form */}
            <Card className="max-w-2xl">
              <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Business Name</label>
                      <Input {...register('businessName', validationRules.agencyName)} />
                      {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input value={profile.email} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input value={profile.phone} disabled className="bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Daily Capacity</label>
                      <Input type="number" {...register('dailyCapacity', { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PAN Number</label>
                      <Input {...register('panNumber')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GST Number</label>
                      <Input {...register('gstNumber')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input {...register('city')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address Line 1</label>
                      <Input {...register('addressLine1')} placeholder="House/Flat No., Street" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address Line 2</label>
                      <Input {...register('addressLine2')} placeholder="Locality, Landmark (optional)" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">State</label>
                      <Input {...register('state')} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Pincode</label>
                      <Input {...register('pincode')} />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-2">
                    <h3 className="text-sm font-medium mb-3">Bank Details</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Account Number</label>
                        <Input {...register('bankAccountNumber')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">IFSC Code</label>
                        <Input {...register('ifscCode')} />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => reset()}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? 'Saving…' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Geolocation Section — required for customer discovery */}
            <Card className="max-w-2xl">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Location</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Your location helps customers find you nearby. Please set it to start receiving requests.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>Set your location so customers can find you nearby. This is required to start receiving booking requests.</span>
                  </div>
                  <AgentGeolocationForm
                    onSave={(location) => updateLocation(location)}
                    isSaving={isLocationSaving}
                  />
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </>
  );
}
