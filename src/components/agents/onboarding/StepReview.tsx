/**
 * @file StepReview.tsx
 * @module components/agents/onboarding
 * @description Step 6 of the agent onboarding carousel. Reviews all collected data
 *   and calls POST /agents/complete-onboarding to finalize.
 */

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle } from 'lucide-react';

interface ReviewData {
  businessName?: string;
  panNumber?: string;
  gstNumber?: string;
  city?: string;
  dailyCapacity?: number;
  isRailwayCertified?: boolean;
  serviceStations?: string[];
  bankAccountNumber?: string;
  ifscCode?: string;
}

interface StepReviewProps {
  data: ReviewData;
  onBack: () => void;
  onComplete: () => void;
  isCompleting?: boolean;
}

export function StepReview({ data, onBack, onComplete, isCompleting }: StepReviewProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Review & Complete</h3>
        <p className="text-sm text-muted-foreground">Review your information before finishing</p>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
          <div><span className="text-muted-foreground">Business Name:</span> <span className="font-medium">{data.businessName}</span></div>
          <div><span className="text-muted-foreground">PAN:</span> <span className="font-medium">{data.panNumber}</span></div>
          <div><span className="text-muted-foreground">GST:</span> <span className="font-medium">{data.gstNumber}</span></div>
          <div><span className="text-muted-foreground">City:</span> <span className="font-medium">{data.city}</span></div>
          <div><span className="text-muted-foreground">Daily Capacity:</span> <span className="font-medium">{data.dailyCapacity}</span></div>
          <div><span className="text-muted-foreground">Certified:</span> <span className="font-medium">{data.isRailwayCertified ? 'Yes' : 'No'}</span></div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Service Stations:</span>{' '}
            <span className="font-medium">{data.serviceStations?.join(', ') || 'None'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground">Bank Account:</span>{' '}
            <span className="font-medium">{data.bankAccountNumber} ({data.ifscCode})</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} disabled={isCompleting}>← Back</Button>
        <Button type="button" onClick={onComplete} disabled={isCompleting}>
          {isCompleting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Completing…</>
          ) : (
            <><CheckCircle className="mr-2 h-4 w-4" /> Complete Onboarding</>
          )}
        </Button>
      </div>
    </div>
  );
}
