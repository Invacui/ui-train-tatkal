export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Manufacturing',
  'Real Estate',
  'Legal',
  'Marketing',
  'Consulting',
  'Hospitality',
  'Transportation',
  'Energy',
  'Media',
  'Other',
] as const;

export type Industry = (typeof INDUSTRIES)[number];
