/**
 * @file Agent team management page
 * @module routes/agent/Team
 * @description Allows agents to manage their team members by adding members
 *   with name, phone, and email. Wired to the real backend API.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React hooks
import { useState } from 'react';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

// React Query mutation
import { useMutation, useQueryClient } from '@tanstack/react-query';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Agent service for API calls
import { agentsService } from '@/services/agents.service';

// Query key factory
import { queryKeys } from '@/lib/queryKeys';

// Team member DTO type
import type { TeamMemberDto } from '@/types/agents.types';

// Toast notification
import { toast } from 'sonner';

// Icons
import { Trash2, Users, UserPlus, Loader2 } from 'lucide-react';

interface TeamMemberFormValues {
  name: string;
  phone: string;
  email: string;
}

interface TeamMemberDisplay {
  id: string;
  name: string;
  phone: string;
  email: string;
}

/**
 * AgentTeam (page component)
 * @description Renders a team management page with an add member form
 *   and a list of existing team members. Uses real API calls.
 */
export default function AgentTeam() {
  const queryClient = useQueryClient();
  const [members, setMembers] = useState<TeamMemberDisplay[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TeamMemberFormValues>();

  const { mutate: addMember, isPending: isAdding } = useMutation({
    mutationFn: (dto: TeamMemberDto) => agentsService.addTeamMember(dto),
    onSuccess: (_, variables) => {
      // Optimistically add to local list
      const newMember: TeamMemberDisplay = {
        id: `temp-${Date.now()}`,
        name: variables.name,
        phone: variables.phone,
        email: variables.email,
      };
      setMembers((prev) => [...prev, newMember]);
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.profile() });
      toast.success(`Team member ${variables.name} added`);
      reset();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add team member';
      toast.error(message);
    },
  });

  const { mutate: removeMember, isPending: isRemoving } = useMutation({
    mutationFn: (memberId: string) => agentsService.removeTeamMember(memberId),
    onSuccess: (_data, memberId) => {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      queryClient.invalidateQueries({ queryKey: queryKeys.agents.profile() });
      toast.success('Team member removed');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to remove team member';
      toast.error(message);
    },
  });

  const onSubmit = (data: TeamMemberFormValues) => {
    addMember({ name: data.name, phone: data.phone, email: data.email });
  };

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Team Management" description="Add or remove team members" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Add Member Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Team Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...register('name', { required: 'Name is required' })} placeholder="Member name" />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...register('phone', { required: 'Phone is required' })} placeholder="9876543210" />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input type="email" {...register('email', { required: 'Email is required' })} placeholder="member@example.com" />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding…</>
                  ) : (
                    'Add Member'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No team members yet. Add your first member to get started.
                </div>
              ) : (
                <div className="divide-y">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.phone} · {member.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeMember(member.id)}
                        disabled={isRemoving}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
