export type ConversationStatus = 'OPEN' | 'CLOSED' | 'PENDING';
export type ConversationChannel = 'EMAIL' | 'WHATSAPP';

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'AI' | 'LEAD' | 'USER';
  sentAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  campaignId: string;
  channel: ConversationChannel;
  status: ConversationStatus;
  lastMessageAt: string;
  messages: Message[];
  createdAt: string;
}

export interface ManualReplyDto {
  content: string;
  channel: ConversationChannel;
}
