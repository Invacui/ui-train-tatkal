/**
 * @file FamilyMemberSelector.tsx
 * @description Shows selected family members as removable chips and remaining
 *   family members with a +Add button. Auto-selects all on first mount.
 * @module components/checkout
 */

import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, X, Plus, Users } from 'lucide-react';

import type { FamilyMember } from '@/types/auth.types';

interface FamilyMemberSelectorProps {
  familyMembers: FamilyMember[];
  selectedIds: string[];
  maxSeats: number;
  onSelectionChange: (ids: string[]) => void;
  onAddNew: () => void;
}

/**
 * FamilyMemberSelector
 * @description Renders selected family members as removable chips and unselected
 *   ones below with +Add buttons. On mount, all family members are auto-selected.
 */
export function FamilyMemberSelector({
  familyMembers,
  selectedIds,
  maxSeats,
  onSelectionChange,
  onAddNew,
}: FamilyMemberSelectorProps) {
  const selectedMembers = useMemo(
    () => familyMembers.filter((m) => selectedIds.includes(m.id)),
    [familyMembers, selectedIds],
  );
  const availableMembers = useMemo(
    () => familyMembers.filter((m) => !selectedIds.includes(m.id)),
    [familyMembers, selectedIds],
  );

  const remaining = maxSeats - selectedIds.length;
  const isAtMax = remaining <= 0;

  const addMember = (id: string) => {
    if (!isAtMax) {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const removeMember = (id: string) => {
    onSelectionChange(selectedIds.filter((i) => i !== id));
  };

  if (familyMembers.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          No saved family members. Add passengers manually below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Family Members</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {selectedIds.length} of {Math.min(familyMembers.length, maxSeats)} selected
        </span>
      </div>

      {/* Selected members — removable chips */}
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map((member) => (
            <Badge
              key={member.id}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-normal cursor-default">
              <User className="h-3.5 w-3.5" />
              <span>
                {member.firstName} {member.lastName}
              </span>
              <span className="text-muted-foreground mx-0.5">·</span>
              <span className="text-muted-foreground text-xs">{member.relation}</span>
              <button
                type="button"
                onClick={() => removeMember(member.id)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                title="Remove from booking">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Available members to add */}
      {availableMembers.length > 0 && (
        <div className="space-y-1.5">
          {availableMembers.map((member) => (
            <button
              key={member.id}
              type="button"
              disabled={isAtMax}
              onClick={() => addMember(member.id)}
              className={`flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors
                ${isAtMax ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/50 cursor-pointer'}`}>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-muted-foreground/40">
                <Plus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.gender}, Age {member.age} · {member.relation}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAddNew}
        className="text-sm text-primary hover:underline">
        + Add new passenger manually
      </button>
    </div>
  );
}
