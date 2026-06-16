import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { TemplateBuilderForm } from "@/components/templates/TemplateBuilderForm";
import { LaunchConfirmDialog } from "@/components/templates/LaunchConfirmDialog";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplate } from "@/hooks/templates/useTemplate";
import { useUpdateTemplate } from "@/hooks/templates/useUpdateTemplate";
import { useLaunchTemplate } from "@/hooks/templates/useLaunchTemplate";
import { ROUTES } from "@/constants/routes";
import type { CreateTemplateFormValues } from "@/lib/validationRules";

export default function TemplateDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useTemplate(id);
  const { mutate: update, isPending: isUpdating } = useUpdateTemplate(id);
  const { mutate: launch, isPending: isLaunching } = useLaunchTemplate(id);
  const [launchOpen, setLaunchOpen] = useState(false);

  if (isLoading) return <Skeleton className="h-64 w-full rounded-lg" />;
  if (isError) return <ErrorState message={error?.message} />;
  if (!data) return null;

  const handleLaunch = (leadRequestId: string) => {
    launch(
      { leadRequestId },
      {
        onSuccess: (res) => {
          setLaunchOpen(false);
          navigate(ROUTES.campaign(res.data.data.campaignId));
        },
      }
    );
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title={data.name}>
          <Button variant="outline" onClick={() => setLaunchOpen(true)}>
            Launch campaign
          </Button>
        </PageHeader>

        <div className="max-w-lg">
          <TemplateBuilderForm
            defaultValues={data}
            onSubmit={(values: CreateTemplateFormValues) => update(values)}
            isPending={isUpdating}
          />
        </div>
      </div>

      <LaunchConfirmDialog
        open={launchOpen}
        onOpenChange={setLaunchOpen}
        onLaunch={handleLaunch}
        isPending={isLaunching}
      />
    </>
  );
}
