/**
 * @file Account settings page
 * @module routes/dashboard/Settings
 * @description Account management page with profile editing (name, email, phone),
 *   change-password form, address management, Aadhar upload, and family members.
 */

// Helmet for setting page title/meta tags
import { Helmet } from 'react-helmet-async';

// React Hook Form for form state management
import { useForm } from 'react-hook-form';

import { useState } from 'react';

// UI button component
import { Button } from '@/components/ui/button';

// UI input component
import { Input } from '@/components/ui/input';

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Page header with title and description
import { PageHeader } from '@/components/common/PageHeader';

// Profile components
import { UserAddressForm } from '@/components/profile/UserAddressForm';
import { FamilyMemberList } from '@/components/profile/FamilyMemberList';
import { FamilyMemberForm } from '@/components/profile/FamilyMemberForm';
import { FileDropzone } from '@/components/common/FileDropzone';

// Redux hooks for accessing auth state
import { useAppSelector } from '@/store/hooks';

// Selector to access current user info
import { selectUser } from '@/store/auth.slice';

// Custom hooks
import { useUpdateProfile } from '@/hooks/auth/useUpdateProfile';
import { useChangePassword } from '@/hooks/auth/useChangePassword';
import { useUpdateAddress } from '@/hooks/profile/useUpdateAddress';
import { useAddFamilyMember, useUpdateFamilyMember, useDeleteFamilyMember } from '@/hooks/profile/useFamilyMembers';
import { useFileUpload } from '@/hooks/common/useFileUpload';

// Validation rules for form fields
import { validationRules } from '@/lib/validationRules';

// Toast notification for success feedback
import { toast } from 'sonner';

// Types
import type { FamilyMember, UserAddress } from '@/types/auth.types';

/**
 * Settings (page component)
 * @description Renders account settings with profile form, change-password,
 *   address management, Aadhar document upload, and family member CRUD.
 */
export default function Settings() {
  const user = useAppSelector(selectUser);
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();

  // Address
  const updateAddress = useUpdateAddress();
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Family members
  const addFamilyMember = useAddFamilyMember();
  const updateFamilyMember = useUpdateFamilyMember();
  const deleteFamilyMember = useDeleteFamilyMember();
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [showAddFamilyForm, setShowAddFamilyForm] = useState(false);

  // Aadhar
  const fileUpload = useFileUpload();
  const { mutate: updateProfileWithAadhar, isPending: isAadharUploading } = useUpdateProfile();
  const [aadharId, setAadharId] = useState(user?.aadharId || '');
  const [isUploadingAadhar, setIsUploadingAadhar] = useState(false);

  const { register: regProfile, handleSubmit: submitProfile } = useForm({
    defaultValues: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '' },
  });

  const { register: regPassword, handleSubmit: submitPassword, watch, reset: resetPassword } = useForm();

  const handleAadharFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingAadhar(true);
    try {
      const url = await fileUpload.upload(files[0], 'aadhar');
      updateProfileWithAadhar(
        { aadharId, aadharDocUrl: url } as any,
        { onSuccess: () => toast.success('Aadhar document uploaded') },
      );
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setIsUploadingAadhar(false);
    }
  };

  const handleSaveAadharId = () => {
    updateProfileWithAadhar(
      { aadharId } as any,
      { onSuccess: () => toast.success('Aadhar ID saved') },
    );
  };

  const familyMembers = user?.familyMembers || [];

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" description="Manage your account" />

        {/* Profile Section */}
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitProfile((v) => updateProfile(v, { onSuccess: () => toast.success('Profile updated') }))} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...regProfile('name', validationRules.name)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...regProfile('email', validationRules.email)} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...regProfile('phone', validationRules.phone)} />
                </div>
              </div>
              <Button type="submit" disabled={isUpdating} className="w-fit">
                {isUpdating ? 'Saving…' : 'Save changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitPassword((v) => changePassword(
              { oldPassword: v.oldPassword, newPassword: v.newPassword },
              { onSuccess: () => resetPassword() },
            ))} className="flex flex-col gap-4 sm:max-w-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current password</label>
                <Input type="password" {...regPassword('oldPassword', validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New password</label>
                <Input type="password" {...regPassword('newPassword', validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm new password</label>
                <Input type="password" {...regPassword('confirmPassword', validationRules.confirmPassword(watch))} />
              </div>
              <Button type="submit" disabled={isChanging} className="w-fit">
                {isChanging ? 'Updating…' : 'Change password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Address Section */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent>
            {user?.address && !showAddressForm ? (
              <div className="space-y-3">
                <div className="rounded-md border p-3 text-sm">
                  <p>{user.address.line1}</p>
                  {user.address.line2 && <p>{user.address.line2}</p>}
                  <p>{user.address.city}, {user.address.state} — {user.address.pincode}</p>
                  {user.address.lat && user.address.lon && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {user.address.lat.toFixed(4)}, Lon: {user.address.lon.toFixed(4)}
                    </p>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(true)}>
                  Edit Address
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {!showAddressForm ? (
                  <Button onClick={() => setShowAddressForm(true)}>
                    Add Address
                  </Button>
                ) : (
                  <UserAddressForm
                    address={user?.address}
                    onSave={(addr) => {
                      updateAddress.mutate(addr, {
                        onSuccess: () => {
                          setShowAddressForm(false);
                          toast.success('Address updated');
                        },
                      });
                    }}
                    onCancel={() => setShowAddressForm(false)}
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Aadhar Section */}
        <Card>
          <CardHeader>
            <CardTitle>Aadhar Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhar Number</label>
              <div className="flex gap-2">
                <Input
                  value={aadharId}
                  onChange={(e) => setAadharId(e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  className="max-w-xs"
                />
                <Button
                  variant="outline"
                  onClick={handleSaveAadharId}
                  disabled={isAadharUploading || !aadharId}
                >
                  Save
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhar Document (PDF)</label>
              {user?.aadharDocUrl && (
                <p className="text-xs text-muted-foreground mb-2">
                  Current file: <a href={user.aadharDocUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">View document</a>
                </p>
              )}
              <FileDropzone
                accept={{ 'application/pdf': ['.pdf'] }}
                onFile={async (file: File) => {
                  await handleAadharFileUpload([file]);
                }}
              />
              {isUploadingAadhar && <p className="text-xs text-muted-foreground">Uploading...</p>}
            </div>
          </CardContent>
        </Card>

        {/* Family Members Section */}
        <FamilyMemberList
          members={familyMembers}
          maxCount={4}
          onAdd={() => {
            setEditingMember(null);
            setShowAddFamilyForm(true);
          }}
          onEdit={(member) => {
            setEditingMember(member);
            setShowAddFamilyForm(true);
          }}
          onDelete={(id) => {
            deleteFamilyMember.mutate(id, {
              onSuccess: () => toast.success('Family member removed'),
            });
          }}
        />

        {showAddFamilyForm && (
          <FamilyMemberForm
            member={editingMember ?? undefined}
            onSave={(data) => {
              if (editingMember) {
                updateFamilyMember.mutate(
                  { id: editingMember.id, dto: data },
                  { onSuccess: () => { setShowAddFamilyForm(false); toast.success('Family member updated'); } },
                );
              } else {
                addFamilyMember.mutate(
                  data,
                  { onSuccess: () => { setShowAddFamilyForm(false); toast.success('Family member added'); } },
                );
              }
            }}
            onCancel={() => {
              setShowAddFamilyForm(false);
              setEditingMember(null);
            }}
          />
        )}
      </div>
    </>
  );
}
