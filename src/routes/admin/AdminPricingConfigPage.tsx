/**
 * @file AdminPricingConfigPage.tsx
 * @description Admin page for viewing and editing the pricing configuration.
 * @module routes/admin
 */

import { AdminPricingConfig } from '@/components/admin/AdminPricingConfig';
import { PageHeader } from '@/components/common/PageHeader';
import { usePricingConfig, useUpdatePricingConfig } from '@/hooks/pricing/usePricingConfig';

/**
 * AdminPricingConfigPage
 * @description Page component that fetches the current pricing config and
 *   renders the editable form. Uses React Query for data fetching and mutations.
 */
export default function AdminPricingConfigPage() {
  const { data: config, isLoading } = usePricingConfig();
  const updateConfig = useUpdatePricingConfig();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pricing Configuration"
        description="Manage fee structure, charges, and commissions"
      />
      <AdminPricingConfig
        config={config}
        isLoading={isLoading}
        onSave={(dto) => updateConfig.mutate(dto)}
        isSaving={updateConfig.isPending}
      />
    </div>
  );
}
