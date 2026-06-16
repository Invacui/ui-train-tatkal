export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  channel: 'EMAIL' | 'WHATSAPP';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  subject: string;
  body: string;
  channel: 'EMAIL' | 'WHATSAPP';
}

export interface UpdateTemplateDto extends Partial<CreateTemplateDto> {}

export interface LaunchDto {
  leadRequestId: string;
}

export interface TemplatePreview {
  subject: string;
  body: string;
  sampleLead: Record<string, string>;
}
