import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLeadRequests } from '@/hooks/leads/useLeadRequests';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadListSelectorProps {
  value: string;
  onChange: (id: string) => void;
}

export function LeadListSelector({ value, onChange }: LeadListSelectorProps) {
  const { data: requests, isLoading } = useLeadRequests();

  const readyRequests = requests?.filter((r) => r.status === 'READY') ?? [];

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a lead list…" />
      </SelectTrigger>
      <SelectContent>
        {readyRequests.map((r) => (
          <SelectItem key={r.id} value={r.id}>
            {r.name} ({r.totalLeads.toLocaleString()} leads)
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
