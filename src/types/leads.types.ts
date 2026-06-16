export type LeadRequestStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface LeadRequest {
  id: string;
  name: string;
  status: LeadRequestStatus;
  totalLeads: number;
  processedLeads: number;
  fileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  leadRequestId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  industry?: string;
  createdAt: string;
}

export interface CreateLeadDto {
  name: string;
  leadListId: string;
}

export interface UploadLeadDto {
  name: string;
  file: File;
}
