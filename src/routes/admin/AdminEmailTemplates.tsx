/**
 * @file Admin email templates page
 * @module routes/admin/AdminEmailTemplates
 * @description Placeholder page for managing email notification templates.
 *   Full template management UI is planned for a future update.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

/**
 * AdminEmailTemplates (page component)
 * @description Placeholder page for email template management. Currently
 *   displays a coming-soon message.
 */
export default function AdminEmailTemplates() {
  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Email Templates" description="Manage email notification templates" />
        <Card>
          <CardHeader><CardTitle>Templates</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email template management will be available soon.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
