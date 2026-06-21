/**
 * @file Status Badge component
 * @module components/common/StatusBadge
 * @description Renders a colored badge for a given status string. Supports
 *   workflow statuses (PENDING, PROCESSING, etc.), train booking statuses
 *   (confirmed, cancelled, waiting_list, etc.), and more with
 *   color-coded background and text classes per status.
 */

// Shadcn badge component
import { Badge } from '@/components/ui/badge';

// Utility for conditional class names
import { cn, getBookingStatusVariant } from '@/lib/utils';

type Status =
  | 'PENDING'
  | 'PROCESSING'
  | 'READY'
  | 'FAILED'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETED'
  | 'OPEN'
  | 'CLOSED'
  | 'SENT'
  | 'OPENED'
  | 'REPLIED'
  // Train booking statuses
  | 'confirmed'
  | 'cancelled'
  | 'waiting_list'
  | 'failed'
  | 'refunded'
  | 'refund_initiated'
  | 'delivered'
  | 'completed'
  | 'pending_agent'
  | 'agent_assigned'
  | 'at_counter'
  | 'booking_in_progress'
  | 'pnr_submitted'
  | 'payment_pending'
  | 'active'
  | 'suspended'
  | 'pending';

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  PROCESSING: { label: 'Processing', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  READY: { label: 'Ready', className: 'bg-green-100 text-green-800 border-green-200' },
  FAILED: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
  RUNNING: { label: 'Running', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  PAUSED: { label: 'Paused', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  COMPLETED: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  OPEN: { label: 'Open', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  CLOSED: { label: 'Closed', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  SENT: { label: 'Sent', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  OPENED: { label: 'Opened', className: 'bg-green-100 text-green-800 border-green-200' },
  REPLIED: { label: 'Replied', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  // Train booking statuses
  confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800 border-green-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200' },
  waiting_list: { label: 'Waiting List', className: 'bg-orange-100 text-orange-800 border-orange-200' },
  failed: { label: 'Failed', className: 'bg-red-100 text-red-800 border-red-200' },
  refunded: { label: 'Refunded', className: 'bg-red-100 text-red-800 border-red-200' },
  refund_initiated: { label: 'Refund Initiated', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 border-green-200' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 border-green-200' },
  pending_agent: { label: 'Finding Agent', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  agent_assigned: { label: 'Agent Assigned', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  at_counter: { label: 'At Counter', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  booking_in_progress: { label: 'Booking in Progress', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  pnr_submitted: { label: 'PNR Submitted', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  payment_pending: { label: 'Payment Pending', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  active: { label: 'Active', className: 'bg-green-100 text-green-800 border-green-200' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-800 border-red-200' },
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
};

interface StatusBadgeProps {
  /** The status key to display (e.g. "PENDING", "confirmed", "cancelled") */
  status: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * StatusBadge
 * @description Renders a colored badge for a given status string. Looks up
 *   the status in a config map to get the appropriate label and color classes.
 *   Falls back to displaying the raw status string if not found.
 * @param props StatusBadgeProps
 * @returns A Badge component with status-appropriate colors
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: '' };
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
