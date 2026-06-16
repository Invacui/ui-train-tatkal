import { describe, it, expect } from 'vitest';
import { ROUTES } from '@/constants/routes';

describe('ROUTES', () => {
  it('has correct static routes', () => {
    expect(ROUTES.home).toBe('/');
    expect(ROUTES.login).toBe('/login');
    expect(ROUTES.signup).toBe('/signup');
    expect(ROUTES.dashboard).toBe('/dashboard');
    expect(ROUTES.leads).toBe('/leads');
    expect(ROUTES.templates).toBe('/templates');
    expect(ROUTES.campaigns).toBe('/campaigns');
    expect(ROUTES.conversations).toBe('/conversations');
    expect(ROUTES.settings).toBe('/settings');
  });

  it('generates dynamic lead route', () => {
    expect(ROUTES.lead('abc123')).toBe('/leads/abc123');
  });

  it('generates dynamic template route', () => {
    expect(ROUTES.template('tpl1')).toBe('/templates/tpl1');
  });

  it('generates dynamic campaign route', () => {
    expect(ROUTES.campaign('camp1')).toBe('/campaigns/camp1');
  });

  it('generates dynamic conversation route', () => {
    expect(ROUTES.conversation('conv1')).toBe('/conversations/conv1');
  });

  it('has correct admin routes', () => {
    expect(ROUTES.admin.root).toBe('/admin');
    expect(ROUTES.admin.users).toBe('/admin/users');
    expect(ROUTES.admin.user('u1')).toBe('/admin/users/u1');
  });
});
