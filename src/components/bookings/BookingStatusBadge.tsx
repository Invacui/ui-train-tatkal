/**
 * @file Booking Status Badge component
 * @module components/bookings/BookingStatusBadge
 * @description Thin wrapper around StatusBadge that accepts a typed
 *   BookingStatus from the bookings domain.
 */

// Common status badge component
import { StatusBadge } from '@/components/common/StatusBadge';

// Booking status type
import type { BookingStatus } from '@/types/bookings.types';

interface BookingStatusBadgeProps {
  /** The booking status enum value */
  status: BookingStatus;
  /** Additional CSS class names */
  className?: string;
}

/**
 * BookingStatusBadge
 * @description Renders a colored status badge for a booking. Delegates to
 *   the common StatusBadge component with the typed BookingStatus.
 * @param props BookingStatusBadgeProps
 * @returns A status badge element
 */
export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  return <StatusBadge status={status} className={className} />;
}
