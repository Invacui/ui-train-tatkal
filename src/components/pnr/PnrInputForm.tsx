/**
 * @file PNR Input Form component
 * @module components/pnr/PnrInputForm
 * @description PNR input form with auto-formatting (1234 567 890),
 *   validation, and submit button.
 */

import { useState, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PnrInputFormProps {
  onSubmit: (pnr: string) => void;
  isLoading?: boolean;
  error?: string;
}

const PNR_LENGTH = 10;

/**
 * PnrInputForm
 * @description 10-digit PNR input with auto-formatting and validation.
 * Submits on Enter or button click.
 */
export function PnrInputForm({ onSubmit, isLoading = false, error }: PnrInputFormProps) {
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, '').replace(/\D/g, '').slice(0, PNR_LENGTH);
    setValue(raw);
    setLocalError('');
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (value.length !== PNR_LENGTH) {
        setLocalError('PNR must be exactly 10 digits');
        return;
      }
      onSubmit(value);
    },
    [value, onSubmit],
  );

  // Format display: "1234 567 890"
  const displayValue = value
    ? `${value.slice(0, 4)}${value.length > 4 ? ' ' : ''}${value.slice(4, 7)}${value.length > 7 ? ' ' : ''}${value.slice(7)}`
    : '';

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-2">
        <label htmlFor="pnr-input" className="text-sm font-medium text-foreground">
          Enter your 10-digit PNR number
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              id="pnr-input"
              type="text"
              inputMode="numeric"
              placeholder="1234 567 890"
              value={displayValue}
              onChange={handleChange}
              className={cn(
                'h-12 text-lg font-mono tracking-widest',
                displayError && 'border-destructive',
              )}
              disabled={isLoading}
              autoComplete="off"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-12 gap-2 px-6"
            disabled={isLoading || value.length !== PNR_LENGTH}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
            Check
          </Button>
        </div>
        {displayError && (
          <p className="text-xs text-destructive">{displayError}</p>
        )}
      </div>
    </form>
  );
}
