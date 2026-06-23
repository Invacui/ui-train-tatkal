/**
 * @file OnboardingAddress page
 * @module routes/auth/OnboardingAddress
 * @description Address collection page for the onboarding flow.
 *   Collects the user's delivery address (for ticket home delivery)
 *   using the existing UserAddressForm component.
 *   After saving, redirects based on user role.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Router navigation
import { useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';

// Existing address form component
import { UserAddressForm } from '@/components/profile/UserAddressForm';

// Auth service for updating address
import { authService } from '@/services/auth.service';

// Route constants
import { ROUTES } from '@/constants/routes';

// Toast notifications
import { toast } from 'sonner';

// Icons
import { MapPin } from 'lucide-react';

// Address type
import type { UserAddress } from '@/types/auth.types';

/**
 * OnboardingAddress (page component)
 * @description Collects the user's delivery address as part of the
 *   onboarding flow. Uses the existing UserAddressForm component
 *   and calls PATCH /auth/me/address on save.
 *   Redirects to the appropriate dashboard based on user role.
 */
export default function OnboardingAddress() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const handleSave = async (address: UserAddress) => {
    try {
      await authService.updateAddress(address);
      toast.success('Address saved!');
      // Role-based redirect after address save
      if (user?.role === 'agent') {
        navigate(ROUTES.agent.onboard);
      } else {
        navigate(ROUTES.dashboard);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to save address';
      toast.error(message);
    }
  };

  const handleSkip = () => {
    if (user?.role === 'agent') {
      navigate(ROUTES.agent.onboard);
    } else {
      navigate(ROUTES.dashboard);
    }
  };

  return (
    <>
      <Helmet><title>Add Address - TripTatkal</title></Helmet>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-3 text-xl font-semibold">Add Your Address</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We need your delivery address for ticket home delivery.
          </p>
        </div>

        <UserAddressForm
          onSave={handleSave}
          onCancel={handleSkip}
        />

        <p className="text-center text-xs text-muted-foreground">
          <button
            type="button"
            onClick={handleSkip}
            className="text-primary hover:underline"
          >
            Skip for now
          </button>
          <span className="ml-1">— you can add it later in Settings</span>
        </p>
      </div>
    </>
  );
}
