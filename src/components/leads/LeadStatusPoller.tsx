import { useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';
import { leadsService } from '@/services/leads.service';
import type { LeadRequest } from '@/types/leads.types';

interface LeadStatusPollerProps {
  leads: LeadRequest[];
}

/**
 * Polls processing lead requests every 5 seconds until they finish.
 */
export function LeadStatusPoller({ leads }: LeadStatusPollerProps) {
  const qc = useQueryClient();

  const processingIds = useMemo(
    () =>
      leads
        .filter((l) => l.status === 'PROCESSING' || l.status === 'PENDING')
        .map((l) => l.id),
    [leads],
  );

  useEffect(() => {
    if (!processingIds.length) return;

    const interval = setInterval(async () => {
      for (const id of processingIds) {
        try {
          const res = await leadsService.get(id);
          qc.setQueryData(queryKeys.leads.detail(id), res);
          if (res.data.data.status === 'READY' || res.data.data.status === 'FAILED') {
            void qc.invalidateQueries({ queryKey: queryKeys.leads.list() });
          }
        } catch {
          // ignore individual errors
        }
      }
    }, 5_000);

    return () => clearInterval(interval);
  }, [processingIds, qc]);

  return null;
}
