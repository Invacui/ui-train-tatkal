/**
 * @file FamilyMemberList.tsx
 * @description Displays a list of family members with edit/delete actions and an add button.
 * @module components/profile
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, UserPlus } from 'lucide-react';

import type { FamilyMember } from '@/types/auth.types';

interface FamilyMemberListProps {
  members: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  maxCount: number;
}

/**
 * FamilyMemberList
 * @description Renders a list of saved family members as cards with edit and delete
 *   controls. Shows an add button disabled when the max count is reached.
 */
export function FamilyMemberList({ members, onEdit, onDelete, onAdd, maxCount }: FamilyMemberListProps) {
  const isAtMax = members.length >= maxCount;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Family Members</CardTitle>
          <p className="text-sm text-muted-foreground">
            {members.length} of {maxCount} members
          </p>
        </div>
        <Button size="sm" onClick={onAdd} disabled={isAtMax}>
          <UserPlus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {members.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No family members added yet. Add up to {maxCount} members for quick booking.
          </p>
        )}
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {member.firstName} {member.lastName}
                </span>
                <Badge variant="outline" className="text-xs">
                  {member.relation}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Age: {member.age}</span>
                <span>{member.gender.charAt(0).toUpperCase() + member.gender.slice(1)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(member)}
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(member.id)}
                title="Remove"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
