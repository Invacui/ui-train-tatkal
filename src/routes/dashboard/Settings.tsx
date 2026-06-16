import { Helmet } from 'react-helmet-async';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/auth.slice';
import { TokenBadge } from '@/components/common/TokenBadge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';
import { updateUser } from '@/store/auth.slice';

export default function Settings() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      const res = await authService.updateMe({ name: name.trim() });
      dispatch(updateUser(res.data.data));
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-col gap-6">
        <PageHeader title="Settings" description="Manage your account and preferences." />

        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <div className="mt-2 flex gap-2">
                <Input value={name} onChange={(e) => setName(e.target.value)} />
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Token balance</p>
              {user && <TokenBadge amount={user.tokenBalance} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
