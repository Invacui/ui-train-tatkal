import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdjustTokens } from '@/hooks/admin/useAdjustTokens';
import type { AdminUser } from '@/types/admin.types';

interface TokenAdjustDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenAdjustDialog({ user, open, onOpenChange }: TokenAdjustDialogProps) {
  const { mutate, isPending } = useAdjustTokens(user?.id ?? '');
  const { register, handleSubmit, reset } = useForm<{ amount: number; reason: string }>();

  const onSubmit = (values: { amount: number; reason: string }) => {
    mutate(
      { amount: Number(values.amount), reason: values.reason },
      {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      },
    );
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust tokens for {user.name}</DialogTitle>
          <DialogDescription>
            Current balance: {user.tokenBalance.toLocaleString()} tokens. Use a negative number
            to deduct tokens.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount</label>
            <Input
              type="number"
              placeholder="e.g. 1000 or -500"
              {...register('amount', { required: true })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Input placeholder="e.g. Promotional credit" {...register('reason', { required: true })} />
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : 'Apply'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
