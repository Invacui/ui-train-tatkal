import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { LeadUploadForm } from '@/components/leads/LeadUploadForm';
import { ROUTES } from '@/constants/routes';

export default function LeadUpload() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-6">
        <PageHeader title="Upload Leads" description="Import leads from a CSV or XLSX file.">
          <Button variant="outline" onClick={() => navigate(ROUTES.leads)}>
            Cancel
          </Button>
        </PageHeader>

        <div className="max-w-lg">
          <LeadUploadForm />
        </div>
      </div>
    </>
  );
}
