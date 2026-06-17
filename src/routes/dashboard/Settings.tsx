/**
 * @file Account settings page
 * @module routes/dashboard/Settings
 * @description Account management page with profile editing (name, email, phone)
 *   and a change-password form.
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

// Redux hooks for accessing auth state
import { useAppSelector } from '@/store/hooks';

// Selector to access current user info
import { selectUser } from '@/store/auth.slice';

// Custom hook for updating user profile
import { useUpdateProfile } from '@/hooks/auth/useUpdateProfile';

// Custom hook for changing password
import { useChangePassword } from '@/hooks/auth/useChangePassword';

// Validation rules for form fields
import { validationRules } from '@/lib/validationRules';

// Toast notification for success feedback
import { toast } from 'sonner';

/**
 * Settings (page component)
 * @description Renders account settings with a profile form (name, email,
 *   phone) pre-filled from Redux state and a change-password form. Each form
 *   submits independently via its respective mutation hook.
 */
export default function Settings() {
  const user = useAppSelector(selectUser);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();

  const { register: regProfile, handleSubmit: submitProfile } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  });

  const { register: regPassword, handleSubmit: submitPassword, watch, reset: resetPassword } = useForm();

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" description="Manage your account" />

        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitProfile((v) => updateProfile(v, { onSuccess: () => toast.success('Profile updated') }))} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...regProfile('name', validationRules.name)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...regProfile('email', validationRules.email)} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...regProfile('phone', validationRules.phone)} />
                </div>
              </div>
              <Button type="submit" disabled={isUpdating} className="w-fit">
                {isUpdating ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitPassword((v) => changePassword(
              { oldPassword: v.oldPassword, newPassword: v.newPassword },
              { onSuccess: () => resetPassword() },
            ))} className="flex flex-col gap-4 sm:max-w-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current password</label>
                <Input type="password" {...regPassword('oldPassword', validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New password</label>
                <Input type="password" {...regPassword('newPassword', validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm new password</label>
                <Input type="password" {...regPassword('confirmPassword', validationRules.confirmPassword(watch))} />
              </div>
              <Button type="submit" disabled={isChanging} className="w-fit">
                {isChanging ? 'Updating…' : 'Change password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
