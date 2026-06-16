export type CampaignStatus = 'PENDING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'FAILED';

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  templateId: string;
  leadRequestId: string;
  totalLeads: number;
  sentCount: number;
  openCount: number;
  replyCount: number;
  hotLeadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignLog {
  id: string;
  campaignId: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  status: 'SENT' | 'OPENED' | 'REPLIED' | 'FAILED';
  sentAt: string;
}

export interface HotLead {
  id: string;
  leadId: string;
  campaignId: string;
  leadName: string;
  leadEmail: string;
  replyContent: string;
  score: number;
  createdAt: string;
}
