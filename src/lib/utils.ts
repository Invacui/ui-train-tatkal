/**
 * @file Utility functions
 * @description General-purpose helpers for class merging, date formatting, currency, PNR, status display, and more
 * @module lib
 */

// Utility class-name merging (clsx + tailwind-merge)
import { type ClassValue, clsx } from 'clsx';
// Tailwind class conflict resolver
import { twMerge } from 'tailwind-merge';
// Date formatting utilities
import { format, formatDistanceToNow } from 'date-fns';

/**
 * cn
 * @description Merges class names using clsx and tailwind-merge, resolving Tailwind conflicts
 * @param inputs - Class values (strings, objects, arrays) to merge
 * @returns Merged class string with no conflicting Tailwind utilities
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatDate
 * @description Formats a date as a short date string (e.g. "Jan 15, 2025")
 * @param date - Date value to format
 * @param fmt - date-fns format string (default: 'MMM d, yyyy')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, fmt = 'MMM d, yyyy'): string {
  return format(new Date(date), fmt);
}

/**
 * formatDateTime
 * @description Formats a date as a date-time string (e.g. "Jan 15, 2025, 2:30 PM")
 * @param date - Date value to format
 * @param fmt - date-fns format string (default: 'MMM d, yyyy, h:mm a')
 * @returns Formatted date-time string
 */
export function formatDateTime(date: string | Date, fmt = 'MMM d, yyyy, h:mm a'): string {
  return format(new Date(date), fmt);
}

/**
 * relativeTime
 * @description Returns a human-readable relative time string (e.g. "3 hours ago", "in 2 days")
 * @param date - Date to compare against now
 * @returns Relative time string with suffix
 */
export function relativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * truncate
 * @description Truncates a string to a maximum length, appending an ellipsis if truncated
 * @param str - String to truncate
 * @param maxLength - Maximum allowed length before truncation
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
}

/**
 * formatDuration
 * @description Converts an API duration string ("HH:MM" or minutes) into a human-friendly format ("2h 30m")
 * @param duration - Duration string in "HH:MM" format or number-of-minutes string
 * @returns Formatted duration (e.g. "2h 30m")
 */
export function formatDuration(duration: string): string {
  // Handle "HH:MM" format from API or raw minutes
  if (/^\d{1,2}:\d{2}$/.test(duration)) {
    const [h, m] = duration.split(':');
    return `${Number(h)}h ${Number(m)}m`;
  }
  const mins = Number(duration);
  if (Number.isNaN(mins)) return duration;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * formatCurrency
 * @description Formats a numeric amount as Indian Rupee currency with locale formatting
 * @param amount - Numeric amount to format
 * @returns Formatted currency string (e.g. "₹ 1,234")
 */
export function formatCurrency(amount: number): string {
  return `₹ ${amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

/**
 * formatPnr
 * @description Formats a 10-digit PNR number with spaces for readability (e.g. "1234 567 890")
 * @param pnr - Raw PNR string
 * @returns Formatted PNR string
 */
export function formatPnr(pnr: string): string {
  if (pnr.length === 10) {
    return `${pnr.slice(0, 4)} ${pnr.slice(4, 7)} ${pnr.slice(7)}`;
  }
  return pnr;
}

/**
 * getTimeFromDate
 * @description Extracts the HH:mm portion from an ISO date string
 * @param dateStr - ISO date string
 * @returns Time string in HH:mm format
 */
export function getTimeFromDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'HH:mm');
  } catch {
    return dateStr;
  }
}

/**
 * getBookingStatusVariant
 * @description Maps a booking status to a Shadcn button/badge variant for visual styling
 * @param status - Booking status string
 * @returns Shadcn UI variant name
 */
export function getBookingStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' | 'success' {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline' | 'success'> = {
    confirmed: 'success',
    completed: 'success',
    delivered: 'success',
    pnr_submitted: 'default',
    agent_assigned: 'default',
    at_counter: 'default',
    booking_in_progress: 'default',
    pending_agent: 'secondary',
    payment_pending: 'secondary',
    waiting_list: 'outline',
    failed: 'destructive',
    refunded: 'destructive',
    cancelled: 'destructive',
  };
  return variants[status] ?? 'secondary';
}

/**
 * getStatusColor
 * @description Maps a status string to Tailwind CSS colour classes for badges/labels
 * @param status - Status string (booking, agent, or generic)
 * @returns Tailwind colour class string
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    confirmed: 'text-green-600 bg-green-50 border-green-200',
    completed: 'text-green-600 bg-green-50 border-green-200',
    delivered: 'text-green-600 bg-green-50 border-green-200',
    pnr_submitted: 'text-blue-600 bg-blue-50 border-blue-200',
    agent_assigned: 'text-blue-600 bg-blue-50 border-blue-200',
    at_counter: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    booking_in_progress: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    pending_agent: 'text-gray-600 bg-gray-50 border-gray-200',
    payment_pending: 'text-gray-600 bg-gray-50 border-gray-200',
    waiting_list: 'text-orange-600 bg-orange-50 border-orange-200',
    failed: 'text-red-600 bg-red-50 border-red-200',
    refunded: 'text-red-600 bg-red-50 border-red-200',
    cancelled: 'text-red-600 bg-red-50 border-red-200',
    active: 'text-green-600 bg-green-50 border-green-200',
    suspended: 'text-red-600 bg-red-50 border-red-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  };
  return colors[status] ?? 'text-gray-600 bg-gray-50 border-gray-200';
}

/**
 * getStatusLabel
 * @description Converts a snake_case status string into a human-readable label (e.g. "payment_pending" -> "Payment Pending")
 * @param status - Snake_case status string
 * @returns Human-readable status label
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    payment_pending: 'Payment Pending',
    pending_agent: 'Finding Agent',
    agent_assigned: 'Agent Assigned',
    at_counter: 'At Counter',
    booking_in_progress: 'Booking in Progress',
    pnr_submitted: 'PNR Submitted',
    confirmed: 'Confirmed',
    waiting_list: 'Waiting List',
    failed: 'Failed',
    refunded: 'Refunded',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return labels[status] ?? status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * formatSeatLabel
 * @description Formats a coach and seat number into a combined label (e.g. "A1-023")
 * @param coach - Coach name/identifier
 * @param seatNumber - Seat number
 * @returns Combined seat label
 */
export function formatSeatLabel(coach: string, seatNumber: string): string {
  return `${coach}-${seatNumber}`;
}
