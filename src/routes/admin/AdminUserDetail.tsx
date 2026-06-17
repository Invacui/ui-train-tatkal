/**
 * @file Admin user detail page
 * @module routes/admin/AdminUserDetail
 * @description Shows details for a specific platform user. Currently a
 *   placeholder view with user ID displayed.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// Route params to extract user ID, navigation for back button
import { useParams, useNavigate } from 'react-router-dom';

// ArrowLeft icon for back button
import { ArrowLeft } from 'lucide-react';

// UI button component
import { Button } from '@/components/ui/button';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

/**
 * AdminUserDetail (page component)
 * @description Placeholder user detail page showing basic user info. Full
 *   user management details to be implemented.
 */
export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="w-fit gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <PageHeader title="User Details" description={`User ID: ${id}`} />
        <Card>
          <CardHeader><CardTitle>User Information</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">User detail view. Full user info will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
