import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState, useEffect } from 'react';

interface UserProfilePageProps {
  onMenuClick?: () => void;
}

export function UserProfilePage({ onMenuClick }: UserProfilePageProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const resData = await response.json();
        if (response.ok && resData.success && resData.data) {
          const user = resData.data;
          setFullName(user.fullName || '');
          setPhone(user.phone || '');
          setEmail(user.email || '');
          setJobTitle(user.jobTitle || '');
          setLinkedin(user.linkedin || '');
          setInstagram(user.instagram || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/v1/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          phone,
          jobTitle,
          linkedin,
          instagram
        })
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setSuccessMsg('Profile updated successfully!');
      } else {
        setErrorMsg(resData.error || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg('Connection error. Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500">Edit Profile</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage your personal information and stationery card configurations</p>
          </div>
          
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-t-primary border-r-transparent animate-spin"></div>
            </div>
          ) : (
            <Card className="shadow-md border-border/50">
              <CardHeader>
                <CardTitle className="text-xl">Personal Information</CardTitle>
                <CardDescription>Configure contact details automatically filled during card customizations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Job Title</label>
                    <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="Chief Executive Officer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Phone Number</label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Email Address (Read-only)</label>
                    <Input value={email} disabled className="bg-muted/40 cursor-not-allowed" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">LinkedIn URL</label>
                    <Input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="linkedin.com/in/johndoe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">Instagram Username</label>
                    <Input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@johndoe" />
                  </div>
                </div>

                {successMsg && <p className="text-xs text-emerald-500 font-semibold">{successMsg}</p>}
                {errorMsg && <p className="text-xs text-destructive font-semibold">{errorMsg}</p>}

                <div className="pt-2">
                  <Button 
                    className="bg-primary text-white font-bold px-6" 
                    disabled={saving} 
                    onClick={handleSaveChanges}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
