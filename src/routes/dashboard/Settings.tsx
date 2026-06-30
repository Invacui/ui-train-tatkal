/**
 * @file Account settings page
 * @module routes/dashboard/Settings
 * @description Account management page with profile editing (name, email, phone),
 *   change-password form, address management, Aadhar upload, and family members.
 */

// Helmet for setting page title/meta tags
import { Helmet } from "react-helmet-async";

// React Hook Form for form state management
import { useForm } from "react-hook-form";

import { useState } from "react";

// UI button component
import { Button } from "@/components/ui/button";

// UI input component
import { Input } from "@/components/ui/input";

// Badge component for email verification status
import { Badge } from "@/components/ui/badge";

// Card components for layout
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Page header with title and description
import { PageHeader } from "@/components/common/PageHeader";

// Profile components
import { UserAddressForm } from "@/components/profile/UserAddressForm";
import { FamilyMemberList } from "@/components/profile/FamilyMemberList";
import { FamilyMemberForm } from "@/components/profile/FamilyMemberForm";
import { FileDropzone } from "@/components/common/FileDropzone";
import { authService } from "@/services/auth.service";

// Redux hooks for accessing auth state
import { useAppSelector } from "@/store/hooks";

// Selector to access current user info
import { selectUser } from "@/store/auth.slice";

// Custom hooks
import { useProfile } from "@/hooks/auth/useProfile";
import { useUpdateProfile } from "@/hooks/auth/useUpdateProfile";
import { useChangePassword } from "@/hooks/auth/useChangePassword";
import { useUpdateAddress } from "@/hooks/profile/useUpdateAddress";
import {
  useAddFamilyMember,
  useUpdateFamilyMember,
  useDeleteFamilyMember,
} from "@/hooks/profile/useFamilyMembers";

// Validation rules for form fields
import { validationRules } from "@/lib/validationRules";

// Toast notification for success feedback
import { toast } from "sonner";

// Types
import type { FamilyMember, UserAddress } from "@/types/auth.types";
import { useSendEmailVerification } from "@/hooks/auth/useVerifyEmail";
import { useUpdateAadhar } from "@/hooks/profile/useUpdateAadhar";

/**
 * Settings (page component)
 * @description Renders account settings with profile form, change-password,
 *   address management, Aadhar document upload, and family member CRUD.
 */
export default function Settings() {
  const user = useAppSelector(selectUser);

  // Fetch fresh profile on mount — syncs Redux with latest server state for
  // address, family members, and Aadhar details
  useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();
  const { mutate: sendVerification, isPending: isSendingVerification } = useSendEmailVerification();

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
  const { mutate: updateAadhar, isPending: isAadharSaving } = useUpdateAadhar();
  const [aadharId, setAadharId] = useState(user?.aadharId || "");
  const [uploadedDocUrl, setUploadedDocUrl] = useState<string | null>(null);
  const [isUploadingAadhar, setIsUploadingAadhar] = useState(false);

  /** True once a document URL is available (fresh upload or saved in profile) */
  const hasAadharDoc = !!(uploadedDocUrl || user?.aadharDocUrl);
  const effectiveDocUrl = uploadedDocUrl || user?.aadharDocUrl || "";

  const handleAadharFileUpload = async (files: File[]) => {
    if (files.length === 0) return;
    setIsUploadingAadhar(true);
    try {
      const res = await authService.uploadAadhar(files[0]);
      const url = res.data.data.url;
      setUploadedDocUrl(url);
      toast.success("Document uploaded successfully");
    } catch {
      toast.error("Failed to upload document");
    } finally {
      setIsUploadingAadhar(false);
    }
  };

  const handleSaveAadhar = () => {
    if (!aadharId || !hasAadharDoc) return;
    updateAadhar(
      { aadharId, aadharDocUrl: effectiveDocUrl },
      {
        onSuccess: () => {
          setUploadedDocUrl(null); // Clear local state — Redux now holds the canonical value
          toast.success("Aadhar details saved");
        },
      },
    );
  };

  const { register: regProfile, handleSubmit: submitProfile } = useForm({
    defaultValues: { name: user?.name || "", email: user?.email || "", phone: user?.phone || "" },
  });

  const {
    register: regPassword,
    handleSubmit: submitPassword,
    watch,
    reset: resetPassword,
  } = useForm();

  const handleViewAadharDocument = async () => {
    const previewUrl = uploadedDocUrl || user?.aadharDocUrl;
    if (!previewUrl) {
      toast.error("No Aadhar document uploaded yet");
      return;
    }
    // If we just uploaded (not saved yet), open the local URL directly
    if (uploadedDocUrl) {
      window.open(uploadedDocUrl, "_blank", "noopener,noreferrer");
      return;
    }
    // Otherwise fetch via API for a fresh URL
    try {
      const res = await authService.getFileUrl("user", user!.id, "aadhar");
      window.open(res.data.data.url, "_blank", "noopener,noreferrer");
    } catch {
      // Fallback to the stored URL
      if (user?.aadharDocUrl) {
        window.open(user.aadharDocUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const familyMembers = user?.familyMembers || [];

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" description="Manage your account" />

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={submitProfile((v) => {
                const emailChanged = v.email && v.email !== user?.email;
                updateProfile(v, {
                  onSuccess: () => {
                    if (emailChanged) {
                      sendVerification(
                        { email: v.email, isEmailNew: true },
                        {
                          onSuccess: () =>
                            toast.success(
                              `Verification email sent to ${v.email}. Please verify before booking.`
                            ),
                        }
                      );
                    } else {
                      toast.success("Profile updated");
                    }
                  },
                });
              })}
              className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input {...regProfile("name", validationRules.name)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input {...regProfile("email", validationRules.email)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input {...regProfile("phone", validationRules.phone)} />
                </div>
              </div>
              <Button type="submit" disabled={isUpdating} className="w-fit">
                {isUpdating ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Verification Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Email Verification</CardTitle>
              {user?.emailVerified ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                  ✓ Verified
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800">
                  ⚠ Not Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Current email: <span className="font-medium text-foreground">{user?.email}</span>
            </p>
            {user?.emailVerified ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Your email is verified. You can change it above — a new verification link will be
                sent.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  Your email is not verified. Please verify to access all features including
                  bookings.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => sendVerification({ email: user?.email })}
                  disabled={isSendingVerification}>
                  {isSendingVerification ? "Sending…" : "Resend Verification Email"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Password Section */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={submitPassword((v) =>
                changePassword(
                  { oldPassword: v.oldPassword, newPassword: v.newPassword },
                  { onSuccess: () => resetPassword() }
                )
              )}
              className="flex flex-col gap-4 sm:max-w-sm">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current password</label>
                <Input type="password" {...regPassword("oldPassword", validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New password</label>
                <Input type="password" {...regPassword("newPassword", validationRules.password)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm new password</label>
                <Input
                  type="password"
                  {...regPassword("confirmPassword", validationRules.confirmPassword(watch))}
                />
              </div>
              <Button type="submit" disabled={isChanging} className="w-fit">
                {isChanging ? "Updating…" : "Change password"}
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
                  <p>
                    {user.address.city}, {user.address.state} — {user.address.pincode}
                  </p>
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
                  <Button onClick={() => setShowAddressForm(true)}>Add Address</Button>
                ) : (
                  <UserAddressForm
                    address={user?.address}
                    onSave={(addr) => {
                      updateAddress.mutate(addr, {
                        onSuccess: () => {
                          setShowAddressForm(false);
                          toast.success("Address updated");
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
          <CardContent className="space-y-6">
            {/* Step 1: Upload Document */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Step 1: Upload Aadhar Document</label>
              {hasAadharDoc && (
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="text-green-600 font-medium">✓ Document uploaded</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleViewAadharDocument}>
                    View
                  </Button>
                  {uploadedDocUrl && (
                    <span className="text-xs text-muted-foreground">
                      (Save your Aadhar number below to persist)
                    </span>
                  )}
                </div>
              )}
              <FileDropzone
                accept={{
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/webp": [".webp"],
                  "application/pdf": [".pdf"],
                }}
                onFile={async (file: File) => {
                  await handleAadharFileUpload([file]);
                }}
              />
              {isUploadingAadhar && (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              )}
            </div>

            {/* Step 2: Enter Aadhar Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Step 2: Enter Aadhar Number</label>
              <div className="flex gap-2">
                <Input
                  value={aadharId}
                  onChange={(e) => setAadharId(e.target.value)}
                  placeholder="Enter 12-digit Aadhar number"
                  className="max-w-xs"
                />
                <Button
                  onClick={handleSaveAadhar}
                  disabled={isAadharSaving || !aadharId || !hasAadharDoc}>
                  {isAadharSaving ? "Saving…" : "Save"}
                </Button>
              </div>
              {!hasAadharDoc && (
                <p className="text-xs text-amber-600">
                  Upload a document first to enable saving.
                </p>
              )}
              {hasAadharDoc && !uploadedDocUrl && user?.aadharDocUrl && (
                <p className="text-xs text-muted-foreground">
                  Document already saved. You can re-upload to replace it.
                </p>
              )}
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
              onSuccess: () => toast.success("Family member removed"),
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
                  {
                    onSuccess: () => {
                      setShowAddFamilyForm(false);
                      toast.success("Family member updated");
                    },
                  }
                );
              } else {
                addFamilyMember.mutate(data, {
                  onSuccess: () => {
                    setShowAddFamilyForm(false);
                    toast.success("Family member added");
                  },
                });
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
