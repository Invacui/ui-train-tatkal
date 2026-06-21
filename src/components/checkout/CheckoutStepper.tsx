/**
 * @file CheckoutStepper.tsx
 * @description Horizontal step progress indicator for the multi-step checkout flow.
 * @module components/checkout
 */

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { BookingStep } from '@/store/booking-draft.slice';

interface CheckoutStepperProps {
  currentStep: BookingStep;
  steps: { key: BookingStep; label: string }[];
}

/**
 * CheckoutStepper
 * @description Renders a horizontal stepper showing all steps. Completed steps
 *   show a green checkmark, the current step is highlighted, and future steps are gray.
 */
export function CheckoutStepper({ currentStep, steps }: CheckoutStepperProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Checkout progress" className="w-full overflow-x-auto">
      <ol className="flex items-center min-w-max gap-0">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <li key={step.key} className="flex items-center">
              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold border-2 transition-colors',
                    isCompleted && 'border-green-500 bg-green-50 text-green-600',
                    isCurrent && 'border-primary bg-primary/10 text-primary',
                    !isCompleted && !isCurrent && 'border-muted-foreground/30 text-muted-foreground/50',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-1 whitespace-nowrap',
                    isCompleted && 'text-green-600 font-medium',
                    isCurrent && 'text-primary font-medium',
                    !isCompleted && !isCurrent && 'text-muted-foreground/50',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 w-12 mx-2 mb-5',
                    isCompleted ? 'bg-green-500' : 'bg-muted-foreground/20',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
