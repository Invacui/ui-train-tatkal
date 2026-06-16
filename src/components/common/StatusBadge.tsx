import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  | 'REPLIED';

const statusConfig: Record<
  Status,
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
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: '' };
  return (
    <Badge variant="outline" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
