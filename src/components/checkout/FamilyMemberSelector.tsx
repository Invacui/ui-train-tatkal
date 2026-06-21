/**
 * @file FamilyMemberSelector.tsx
 * @description Checkbox-based selector for choosing passengers from saved family members.
 * @module components/checkout
 */

import { useMemo } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';

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
 * @description Renders a list of saved family members with checkboxes. The user can
 *   select which family members to include as passengers. Shows a count indicator
 *   and an "Add new passenger" link for manual entry.
 */
export function FamilyMemberSelector({
  familyMembers,
  selectedIds,
  maxSeats,
  onSelectionChange,
  onAddNew,
}: FamilyMemberSelectorProps) {
  const remaining = maxSeats - selectedIds.length;

  // The primary/self user is always shown as the first "member"
  const allEntries = useMemo(() => {
    const entries = familyMembers.map((m) => ({ ...m, isPrimary: false }));
    return entries;
  }, [familyMembers]);

  const toggleMember = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else if (remaining > 0) {
      onSelectionChange([...selectedIds, id]);
    }
  };

  if (allEntries.length === 0) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          No saved family members. Add passengers manually below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Select from Family Members</Label>
        <span className="text-xs text-muted-foreground">
          {selectedIds.length} of {maxSeats} seats filled
        </span>
      </div>

      <div className="space-y-2">
        {allEntries.map((member) => {
          const isSelected = selectedIds.includes(member.id);
          const isDisabled = !isSelected && remaining <= 0;
          return (
            <label
              key={member.id}
              className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors
                ${isSelected ? 'border-primary bg-primary/5' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Checkbox
                checked={isSelected}
                disabled={isDisabled}
                onCheckedChange={() => toggleMember(member.id)}
              />
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.gender}, Age {member.age} · {member.relation}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddNew}
        className="text-sm text-primary hover:underline"
      >
        + Add new passenger manually
      </button>
    </div>
  );
}
