import { Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TokenBadgeProps {
  amount: number;
  className?: string;
}

export function TokenBadge({ amount, className }: TokenBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1', className)}>
      <Coins className="h-3 w-3" />
      {amount.toLocaleString()}
    </Badge>
  );
}
