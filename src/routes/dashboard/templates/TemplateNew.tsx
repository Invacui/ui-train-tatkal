import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { TemplateBuilderForm } from "@/components/templates/TemplateBuilderForm";
import { useCreateTemplate } from "@/hooks/templates/useCreateTemplate";
import { ROUTES } from "@/constants/routes";
import type { CreateTemplateFormValues } from "@/lib/validationRules";

export default function TemplateNew() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateTemplate();

  const handleSubmit = (values: CreateTemplateFormValues) => {
    mutate(values, {
      onSuccess: (res) => navigate(ROUTES.template(res.data.data.id)),
    });
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="New Template" description="Create a reusable message template.">
          <Button variant="outline" onClick={() => navigate(ROUTES.templates)}>
            Cancel
          </Button>
        </PageHeader>
        <div className="max-w-lg">
          <TemplateBuilderForm onSubmit={handleSubmit} isPending={isPending} />
        </div>
      </div>
    </>
  );
}
