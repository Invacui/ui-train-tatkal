import { relativeTime } from '@/lib/utils';

interface RelativeTimeProps {
  date: string | Date;
}

export function RelativeTime({ date }: RelativeTimeProps) {
  return <span title={new Date(date).toLocaleString()}>{relativeTime(date)}</span>;
}
