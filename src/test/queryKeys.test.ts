import { describe, it, expect } from 'vitest';
import { queryKeys } from '@/lib/queryKeys';

describe('queryKeys', () => {
  it('returns correct auth.me key', () => {
    expect(queryKeys.auth.me()).toEqual(['auth', 'me']);
  });

  it('returns correct leads.list key', () => {
    expect(queryKeys.leads.list()).toEqual(['leads', 'list']);
  });

  it('returns correct leads.detail key', () => {
    expect(queryKeys.leads.detail('abc')).toEqual(['leads', 'detail', 'abc']);
  });

  it('returns correct campaigns.detail key', () => {
    expect(queryKeys.campaigns.detail('xyz')).toEqual(['campaigns', 'detail', 'xyz']);
  });

  it('returns correct admin.user key', () => {
    expect(queryKeys.admin.user('u1')).toEqual(['admin', 'users', 'u1']);
  });
});
