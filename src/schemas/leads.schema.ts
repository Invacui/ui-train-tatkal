import { z } from 'zod';

export const uploadLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  file: z.instanceof(File, { message: 'Please select a file' }),
});

export const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  leadListId: z.string().min(1, 'Please select a lead list'),
});

export type UploadLeadFormValues = z.infer<typeof uploadLeadSchema>;
export type CreateLeadFormValues = z.infer<typeof createLeadSchema>;
