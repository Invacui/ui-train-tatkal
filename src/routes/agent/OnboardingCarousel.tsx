/**
 * @file Agent onboarding carousel page
 * @module routes/agent/OnboardingCarousel
 * @description 5-step onboarding carousel for new agents. Each step calls
 *   PATCH /agents/profile with its specific fields. Final step calls
 *   POST /agents/complete-onboarding to finalize.
 */

// React hooks
import { useState, useCallback, useEffect } from 'react';

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Router navigation
import { useNavigate } from 'react-router-dom';

// Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectAgent, selectUser, setAgent, setOnboardingCompleted } from '@/store/auth.slice';

// Steps
import { StepBusinessIdentity } from '@/components/agents/onboarding/StepBusinessIdentity';
import { StepAddress } from '@/components/agents/onboarding/StepAddress';
import { StepRailwayDetails } from '@/components/agents/onboarding/StepRailwayDetails';
import { StepBankDetails } from '@/components/agents/onboarding/StepBankDetails';
import { StepReview } from '@/components/agents/onboarding/StepReview';

// React Query hook for agent profile — shares cache with AgentSidebar
import { useAgentProfile } from '@/hooks/agents/useAgentProfile';
// API
import { agentsService } from '@/services/agents.service';

// Route constants
import { ROUTES } from '@/constants/routes';

// Toast notifications
import { toast } from 'sonner';

// Icons
import { CheckCircle } from 'lucide-react';

// Step labels for the progress indicator
const STEPS = [
  'Business Identity',
  'Address & Location',
  'Railway Details',
  'Bank Details',
  'Review & Complete',
];

/**
 * OnboardingCarousel (page component)
 * @description 6-step onboarding wizard for new agents. Collects profile
 *   information progressively, saving each step via PATCH /agents/profile.
 *   On completion, calls POST /agents/complete-onboarding and navigates
 *   to the agent dashboard.
 */
export default function OnboardingCarousel() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const agent = useAppSelector(selectAgent);
  const user = useAppSelector(selectUser);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Summary data accumulated across steps for the review step
  const [summary, setSummary] = useState<Record<string, any>>({
    businessName: agent?.businessName,
    panNumber: agent?.panNumber,
    gstNumber: agent?.gstNumber,
    city: agent?.city,
    dailyCapacity: agent?.dailyCapacity,
    isRailwayCertified: agent?.isRailwayCertified,
    serviceStations: agent?.serviceStations,
    bankAccountNumber: agent?.bankAccountNumber,
    ifscCode: agent?.ifscCode,
  });

  /**
   * On mount, check the API for the actual onboarding state via the shared
   * useAgentProfile React Query hook (same cache as AgentSidebar, so this
   * doesn't cause a duplicate network request).
   *
   * If onboarding is already complete on the server (e.g. from a previous
   * crash or race that dispatched the API call but not the Redux action),
   * sync Redux + localStorage and redirect away so the user isn't stuck.
   *
   * NOTE: We use the Agent profile, NOT /auth/me. The User document
   * never has onboardingCompleted set to true for agents — that field lives
   * on the Agent document. /auth/me would always return false here.
   */
  const [checkedServer, setCheckedServer] = useState(false);
  const { data: freshAgent } = useAgentProfile();

  useEffect(() => {
    if (!freshAgent || checkedServer) return;
    setCheckedServer(true);

    if (freshAgent?.onboardingCompleted) {
      dispatch(setAgent(freshAgent));
      navigate(ROUTES.agent.root, { replace: true });
    }
  }, [freshAgent, checkedServer, dispatch, navigate]);

  /** Strip out empty optional fields so they aren't sent in the request body */
  const cleanData = (data: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  const updateSummary = useCallback((data: Record<string, any>) => {
    setSummary((prev) => ({ ...prev, ...data }));
  }, []);

  const saveStep = useCallback(async (endpoint: string, data: Record<string, any>) => {
    setIsSubmitting(true);
    try {
      const payload = cleanData(data);
      if (Object.keys(payload).length === 0) {
        // Nothing optional to save — just advance to the next step
        setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        return;
      }
      await agentsService.updateProfile(payload as any);
      toast.success('Saved');
      updateSummary(data);
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save');
    } finally {
      setIsSubmitting(false);
    }
  }, [updateSummary]);

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      await agentsService.completeOnboarding();
      dispatch(setOnboardingCompleted());
      toast.success('Onboarding complete! You can now accept bookings.');
      navigate(ROUTES.agent.root);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setIsCompleting(false);
    }
  }, [navigate, dispatch]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /><title>Complete Your Profile - TripTatkal Agent</title></Helmet>
      <div className="mx-auto max-w-2xl py-8">
        {/* Step Progress Indicator */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}
          </p>
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div
                key={label}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/60' : 'bg-muted'
                }`}
                title={label}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {STEPS.map((label, i) => (
              <span key={label} className={`text-[10px] ${i === currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {i < currentStep ? <CheckCircle className="h-3 w-3 inline" /> : `${i + 1}`}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="rounded-lg border bg-card p-6">
          {currentStep === 0 && (
            <StepBusinessIdentity
              defaultValues={{
                businessName: agent?.businessName,
                panNumber: agent?.panNumber,
                gstNumber: agent?.gstNumber,
                businessEmail: agent?.businessEmail,
                businessPhone: agent?.businessPhone,
              }}
              onSubmit={(data) => saveStep('profile', data)}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 1 && (
            <StepAddress
              defaultValues={{
                line1: agent?.address?.line1,
                line2: agent?.address?.line2,
                city: agent?.address?.city || agent?.city,
                state: agent?.address?.state,
                pincode: agent?.address?.pincode,
                lat: agent?.address?.lat,
                lon: agent?.address?.lon,
              }}
              onSubmit={(data) => saveStep('profile', { city: data.address.city, ...data })}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 2 && (
            <StepRailwayDetails
              defaultValues={{
                isRailwayCertified: agent?.isRailwayCertified,
                dailyCapacity: agent?.dailyCapacity,
                serviceStations: agent?.serviceStations,
              }}
              onSubmit={(data) => saveStep('profile', data)}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 3 && (
            <StepBankDetails
              defaultValues={{
                bankAccountNumber: agent?.bankAccountNumber,
                ifscCode: agent?.ifscCode,
              }}
              onSubmit={(data) => saveStep('profile', data)}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}

          {currentStep === 4 && (
            <StepReview
              data={{
                businessName: summary.businessName || agent?.businessName,
                panNumber: summary.panNumber || agent?.panNumber,
                gstNumber: summary.gstNumber || agent?.gstNumber,
                city: summary.city || agent?.city,
                dailyCapacity: summary.dailyCapacity || agent?.dailyCapacity,
                isRailwayCertified: summary.isRailwayCertified ?? agent?.isRailwayCertified,
                serviceStations: summary.serviceStations || agent?.serviceStations,
                bankAccountNumber: summary.bankAccountNumber || agent?.bankAccountNumber,
                ifscCode: summary.ifscCode || agent?.ifscCode,
              }}
              onBack={handleBack}
              onComplete={handleComplete}
              isCompleting={isCompleting}
            />
          )}
        </div>
      </div>
    </>
  );
}
