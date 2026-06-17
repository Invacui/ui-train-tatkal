/**
 * @file Relative Time component
 * @module components/common/RelativeTime
 * @description Displays a date as a human-readable relative time string
 *   (e.g. "2 hours ago") with a tooltip showing the full date.
 */

// Utility function for relative time formatting
import { relativeTime } from '@/lib/utils';

interface RelativeTimeProps {
  /** The date to display, as a Date object or ISO string */
  date: string | Date;
}

/**
 * RelativeTime
 * @description Renders a relative time string (e.g. "3 minutes ago") with
 *   the full date in a tooltip on hover.
 * @param props RelativeTimeProps
 * @returns A span element with relative time text
 */
export function RelativeTime({ date }: RelativeTimeProps) {
  return <span title={new Date(date).toLocaleString()}>{relativeTime(date)}</span>;
}
