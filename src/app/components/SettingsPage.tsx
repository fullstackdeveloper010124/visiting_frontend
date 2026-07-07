import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SettingsPageProps {
  onMenuClick?: () => void;
}

export function SettingsPage({ onMenuClick }: SettingsPageProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <AppHeader onMenuClick={onMenuClick} />
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-6 md:p-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Configure how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails about your account activity.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Processing Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get text messages when your order status changes.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your password and security settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-muted-foreground">Change your account password.</p>
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Theme Style</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
