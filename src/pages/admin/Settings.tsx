
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save, Database, Bell, Shield } from "lucide-react";

const AdminSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    systemName: "Exam Arena",
    emailNotifications: true,
    maintenanceMode: false,
    autoBackup: true,
    maxFileSize: "10",
    sessionTimeout: "30",
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Configure basic system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="systemName">System Name</Label>
              <Input
                id="systemName"
                value={settings.systemName}
                onChange={(e) => setSettings({...settings, systemName: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Configure security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Enable maintenance mode to prevent user access</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxFileSize">Max File Upload Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Backup & Recovery
            </CardTitle>
            <CardDescription>Configure backup settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backups</Label>
                <p className="text-sm text-muted-foreground">Enable automatic daily backups</p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => setSettings({...settings, autoBackup: checked})}
              />
            </div>
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Create Manual Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;
