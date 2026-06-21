/**
 * @file FamilyMemberForm.tsx
 * @description Form for adding or editing a family member (firstName, lastName, age, gender, relation).
 * @module components/profile
 */

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { GENDERS } from '@/constants/enums.constant';

import type { FamilyMember } from '@/types/auth.types';

type FamilyMemberInput = {
  firstName: string;
  lastName?: string;
  age: number;
  gender: FamilyMember['gender'];
  relation: FamilyMember['relation'];
};

interface FamilyMemberFormProps {
  /** Existing member to edit (undefined = add mode) */
  member?: FamilyMember;
  /** Called with the member data on save */
  onSave: (member: FamilyMemberInput) => void;
  /** Called when the user cancels */
  onCancel: () => void;
}

const RELATIONS: FamilyMember['relation'][] = ['spouse', 'child', 'parent', 'sibling', 'other'];

/**
 * FamilyMemberForm
 * @description A form that captures firstName (required), lastName (optional), age,
 *   gender, and relation for a family member.
 */
export function FamilyMemberForm({ member, onSave, onCancel }: FamilyMemberFormProps) {
  const [firstName, setFirstName] = useState(member?.firstName || '');
  const [lastName, setLastName] = useState(member?.lastName || '');
  const [age, setAge] = useState(member?.age?.toString() || '');
  const [gender, setGender] = useState<FamilyMember['gender']>(member?.gender || 'male');
  const [relation, setRelation] = useState<FamilyMember['relation']>(member?.relation || 'spouse');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim() || undefined,
      age: parseInt(age, 10),
      gender,
      relation,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {member ? 'Edit Family Member' : 'Add Family Member'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                placeholder="First name"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={120}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="Age"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="gender">Gender *</Label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as FamilyMember['gender'])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g.toLowerCase()}>
                    {g.charAt(0).toUpperCase() + g.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="relation">Relation *</Label>
              <select
                id="relation"
                value={relation}
                onChange={(e) => setRelation(e.target.value as FamilyMember['relation'])}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {RELATIONS.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{member ? 'Update' : 'Add'} Member</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
