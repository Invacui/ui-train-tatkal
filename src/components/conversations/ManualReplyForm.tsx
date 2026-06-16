import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useManualReply } from '@/hooks/conversations/useManualReply';
import type { ConversationChannel } from '@/types/conversations.types';

interface ManualReplyFormProps {
  conversationId: string;
  defaultChannel?: ConversationChannel;
}

export function ManualReplyForm({
  conversationId,
  defaultChannel = 'EMAIL',
}: ManualReplyFormProps) {
  const { mutate, isPending } = useManualReply(conversationId);
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<ConversationChannel>(defaultChannel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutate(
      { content, channel },
      { onSuccess: () => setContent('') },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your reply…"
        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="flex items-center gap-2">
        <Select value={channel} onValueChange={(v) => setChannel(v as ConversationChannel)}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EMAIL">Email</SelectItem>
            <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={isPending || !content.trim()}>
          {isPending ? 'Sending…' : 'Send reply'}
        </Button>
      </div>
    </form>
  );
}
