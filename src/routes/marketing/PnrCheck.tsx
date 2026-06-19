/**
 * @file PNR Check page
 * @module routes/marketing/PnrCheck
 * @description Public PNR checking page. No authentication required.
 *   Users enter a 10-digit PNR and see full booking status with
 *   train details, passenger manifest, and journey status badge.
 */

import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { ClipboardList, Train } from 'lucide-react';
import { AnimationContainer } from '@/components/marketing/animations/AnimationContainer';
import { PnrInputForm } from '@/components/pnr/PnrInputForm';
import { PnrStatusCard } from '@/components/pnr/PnrStatusCard';
import { ErrorState } from '@/components/common/ErrorState';
import { usePnrStatus } from '@/hooks/pnr/usePnrStatus';

/**
 * PnrCheck (page component)
 * @description Public PNR status checking page. Enter a 10-digit PNR
 *   to see detailed booking status with journey summary and passenger manifest.
 *   Uses staggered animated entry for results.
 */
export default function PnrCheck() {
  const [pnr, setPnr] = useState('');
  const [submittedPnr, setSubmittedPnr] = useState('');
  const [inputError, setInputError] = useState('');

  const { data: pnrData, isLoading, error, isError } = usePnrStatus(
    submittedPnr,
    submittedPnr.length === 10,
  );

  const handleSubmit = useCallback((value: string) => {
    setInputError('');
    setSubmittedPnr(value);
  }, []);

  const handleRetry = () => {
    if (submittedPnr.length === 10) {
      setSubmittedPnr(submittedPnr);
    }
  };

  return (
    <>
      <Helmet>
        <title>PNR Status — TripTatkal</title>
        <meta
          name="description"
          content="Check your train PNR status. Enter your 10-digit PNR number to view booking status, train details, and passenger information."
        />
      </Helmet>

      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:py-20">
          <AnimationContainer variant="fadeInUp">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
          </AnimationContainer>

          <AnimationContainer variant="fadeInUp" delay={0.1}>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              PNR Status
            </h1>
          </AnimationContainer>

          <AnimationContainer variant="fadeInUp" delay={0.2}>
            <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
              Check your train booking status instantly. Enter your 10-digit PNR number below.
            </p>
          </AnimationContainer>

          <AnimationContainer variant="fadeInUp" delay={0.3}>
            <div className="mx-auto mt-8 flex justify-center">
              <PnrInputForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={isError ? (error instanceof Error ? error.message : 'PNR not found') : inputError}
              />
            </div>
          </AnimationContainer>
        </div>
      </section>

      {/* Results section */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4">
          {/* Loading state */}
          {isLoading && (
            <div className="space-y-4">
              <div className="shimmer h-16 w-full rounded-xl" />
              <div className="shimmer h-32 w-full rounded-xl" />
              <div className="shimmer h-48 w-full rounded-xl" />
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="py-8">
              <ErrorState
                message={error instanceof Error ? error.message : 'Unable to fetch PNR status. Please try again.'}
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Results */}
          {pnrData && !isLoading && !isError && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Train className="h-4 w-4" />
                <span>
                  PNR:{' '}
                  <span className="font-mono font-medium text-foreground">
                    {submittedPnr.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')}
                  </span>
                </span>
              </div>
              <PnrStatusCard data={pnrData} />
            </div>
          )}

          {/* Initial (empty) state */}
          {!submittedPnr && !isLoading && (
            <div className="flex flex-col items-center gap-4 py-16 text-center text-muted-foreground">
              <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
              <div>
                <p className="text-lg font-medium">Enter a PNR number to check status</p>
                <p className="mt-1 text-sm">
                  Your PNR is a 10-digit number printed on your railway ticket or booking confirmation.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
