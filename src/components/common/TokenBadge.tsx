/**
 * @file Token Badge component
 * @module components/common/TokenBadge
 * @description Renders a badge displaying a token/coin amount with a coins icon.
 */

// Coins icon
import { Coins } from 'lucide-react';

// Shadcn badge component
import { Badge } from '@/components/ui/badge';

// Utility for conditional class names
import { cn } from '@/lib/utils';

interface TokenBadgeProps {
  /** The token/coin amount to display */
  amount: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * TokenBadge
 * @description Renders a badge with a coins icon and a formatted token amount.
 * @param props TokenBadgeProps
 * @returns A Badge component showing the token amount
 */
export function TokenBadge({ amount, className }: TokenBadgeProps) {
  return (
    <Badge variant="outline" className={cn('gap-1', className)}>
      <Coins className="h-3 w-3" />
      {amount.toLocaleString()}
    </Badge>
  );
}
