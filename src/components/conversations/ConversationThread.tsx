import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/components/common/RelativeTime';
import type { Conversation } from '@/types/conversations.types';
import { cn } from '@/lib/utils';

interface ConversationThreadProps {
  conversation: Conversation;
}

export function ConversationThread({ conversation }: ConversationThreadProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-semibold">{conversation.leadName}</h2>
        <Badge variant="outline">{conversation.channel}</Badge>
        <Badge
          variant="outline"
          className={cn(
            conversation.status === 'OPEN' && 'border-blue-200 bg-blue-50 text-blue-700',
            conversation.status === 'CLOSED' && 'border-gray-200 bg-gray-50 text-gray-700',
          )}
        >
          {conversation.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        {conversation.messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex flex-col gap-1',
              msg.sender === 'USER' || msg.sender === 'AI' ? 'items-end' : 'items-start',
            )}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-lg px-3 py-2 text-sm',
                msg.sender === 'USER' || msg.sender === 'AI'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground',
              )}
            >
              {msg.content}
            </div>
            <span className="text-xs text-muted-foreground">
              {msg.sender} · <RelativeTime date={msg.sentAt} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
