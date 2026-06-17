/**
 * @file Confirm Dialog component
 * @module components/common/ConfirmDialog
 * @description A reusable confirmation dialog with configurable title,
 *   description, confirm/cancel labels, and destructive variant.
 */

// Shadcn dialog components for the modal
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Shadcn button component
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when the dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Dialog title text */
  title: string;
  /** Optional description text beneath the title */
  description?: string;
  /** Label for the confirm button (default: "Confirm") */
  confirmLabel?: string;
  /** Label for the cancel button (default: "Cancel") */
  cancelLabel?: string;
  /** Callback when the confirm button is clicked */
  onConfirm: () => void;
  /** Whether the confirm action is in progress (disables buttons) */
  isPending?: boolean;
  /** Visual style of the confirm button (default: "default") */
  variant?: 'default' | 'destructive';
}

/**
 * ConfirmDialog
 * @description Opens a modal dialog asking the user to confirm an action.
 *   Supports a loading/pending state and destructive variant for dangerous actions.
 * @param props ConfirmDialogProps
 * @returns A dialog component with confirm/cancel buttons
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isPending,
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} disabled={isPending}>
            {isPending ? 'Loading…' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
