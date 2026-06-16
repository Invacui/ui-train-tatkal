import { z } from 'zod';

export const createTemplateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  subject: z.string().min(2, 'Subject must be at least 2 characters'),
  body: z.string().min(10, 'Body must be at least 10 characters'),
  channel: z.enum(['EMAIL', 'WHATSAPP']),
});

export const launchTemplateSchema = z.object({
  leadRequestId: z.string().min(1, 'Please select a lead list'),
});

export type CreateTemplateFormValues = z.infer<typeof createTemplateSchema>;
export type LaunchTemplateFormValues = z.infer<typeof launchTemplateSchema>;
