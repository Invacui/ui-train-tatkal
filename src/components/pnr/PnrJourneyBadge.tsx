/**
 * @file PNR Journey Badge component
 * @module components/pnr/PnrJourneyBadge
 * @description Large status badge showing the derived journey status
 *   (CONFIRMED, RAC, WAITING_LIST, CANCELLED, etc.) with appropriate
 *   color coding and icon.
 */

import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DerivedJourneyStatus } from '@/types/pnr.types';

interface PnrJourneyBadgeProps {
  status: DerivedJourneyStatus;
  chartPrepared?: boolean;
}

const statusConfig: Record<
  DerivedJourneyStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
    description: string;
  }
> = {
  CONFIRMED: {
    label: 'Confirmed',
    icon: CheckCircle2,
    className: 'bg-pnr-confirmed/10 text-pnr-confirmed border-pnr-confirmed/30',
    description: 'All passengers have confirmed berths.',
  },
  RAC: {
    label: 'RAC',
    icon: AlertTriangle,
    className: 'bg-pnr-rac/10 text-pnr-rac border-pnr-rac/30',
    description: 'Reservation Against Cancellation — you can board but may share seat.',
  },
  WAITING_LIST: {
    label: 'Waiting List',
    icon: Clock,
    className: 'bg-pnr-waiting/10 text-pnr-waiting border-pnr-waiting/30',
    description: 'Tickets are on the waiting list — chances of confirmation depend on cancellations.',
  },
  CANCELLED: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-pnr-cancelled/10 text-pnr-cancelled border-pnr-cancelled/30',
    description: 'This booking has been cancelled.',
  },
  PARTIALLY_CONFIRMED: {
    label: 'Partially Confirmed',
    icon: AlertTriangle,
    className: 'bg-pnr-rac/10 text-pnr-rac border-pnr-rac/30',
    description: 'Some passengers are confirmed, others are not.',
  },
  CHART_NOT_PREPARED: {
    label: 'Chart Not Prepared',
    icon: MinusCircle,
    className: 'bg-pnr-chart-not-ready/10 text-pnr-chart-not-ready border-pnr-chart-not-ready/30',
    description: 'Chart has not been prepared yet. Check closer to your journey date.',
  },
};

/**
 * PnrJourneyBadge
 * @description Large, prominent badge showing the overall journey status
 *   with icon, label, and description.
 */
export function PnrJourneyBadge({ status, chartPrepared }: PnrJourneyBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.CHART_NOT_PREPARED;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 rounded-xl border px-4 py-3',
        config.className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-current/10">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold leading-tight">{config.label}</span>
        <span className="text-xs opacity-80">{config.description}</span>
      </div>
      {chartPrepared !== undefined && (
        <div className="ml-auto text-right">
          {chartPrepared ? (
            <span className="rounded-md bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              Chart Prepared
            </span>
          ) : (
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              Chart Not Ready
            </span>
          )}
        </div>
      )}
    </div>
  );
}
