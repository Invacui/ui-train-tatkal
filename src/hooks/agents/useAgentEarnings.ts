/**
 * @file useAgentEarnings.ts
 * @description React Query query hook for fetching the authenticated agent's earnings data.
 * @module hooks/agents/useAgentEarnings
 */

// React Query query hook
import { useQuery } from '@tanstack/react-query';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Agents service API calls
import { agentsService } from '@/services/agents.service';

/**
 * useAgentEarnings
 * @description Fetches the agent's earnings information, including commissions and payouts.
 *   The backend returns an array of earnings entries; this hook computes summary
 *   values (total, this month, last payout) from the entries.
 * @returns A React Query result containing the AgentEarnings summary object.
 */
export function useAgentEarnings() {
  return useQuery({
    queryKey: queryKeys.agents.earnings(),
    queryFn: agentsService.getEarnings,
    select: (res) => {
      const entries = res.data.data;
      if (!entries || entries.length === 0) {
        return {
          totalEarnings: 0,
          thisMonth: 0,
          pendingPayout: 0,
          lastPayout: 0,
          lastPayoutDate: '',
        };
      }
      const now = new Date();
      const thisMonthEntries = entries.filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      return {
        totalEarnings: entries.reduce((sum, e) => sum + e.amount, 0),
        thisMonth: thisMonthEntries.reduce((sum, e) => sum + e.amount, 0),
        pendingPayout: 0, // Backend doesn't track pending payouts separately
        lastPayout: entries[0]?.amount ?? 0,
        lastPayoutDate: entries[0]?.date ?? '',
      };
    },
  });
}
