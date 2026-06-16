import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RelativeTime } from '@/components/common/RelativeTime';
import { ROUTES } from '@/constants/routes';
import { truncate } from '@/lib/utils';
import type { Template } from '@/types/templates.types';

interface TemplatePreviewCardProps {
  template: Template;
}

export function TemplatePreviewCard({ template }: TemplatePreviewCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(ROUTES.template(template.id))}
    >
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <CardTitle className="text-base">{template.name}</CardTitle>
        <Badge variant="outline">{template.channel}</Badge>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-sm font-medium">{template.subject}</p>
        <p className="text-sm text-muted-foreground">{truncate(template.body, 100)}</p>
        <p className="pt-1 text-xs text-muted-foreground">
          <RelativeTime date={template.updatedAt} />
        </p>
      </CardContent>
    </Card>
  );
}
