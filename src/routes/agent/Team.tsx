/**
 * @file Agent team management page
 * @module routes/agent/Team
 * @description Allows agents to manage their team members by adding members
 *   with name, phone, and email. Currently a demo implementation.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Toast notification for demo feedback
import { toast } from 'sonner';

/**
 * AgentTeam (page component)
 * @description Renders a team management form to add team members. Currently
 *   uses a demo toast notification rather than a backend mutation.
 */
export default function AgentTeam() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const addMember = (data: any) => {
    toast.success(`Team member ${data.name} added (demo)`);
    reset();
  };

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Team Management" description="Add or remove team members" />
        <Card className="max-w-lg">
          <CardHeader><CardTitle>Add Team Member</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(addMember)} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input {...register('name', { required: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input {...register('phone', { required: true })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" {...register('email', { required: true })} />
              </div>
              <Button type="submit">Add Member</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
