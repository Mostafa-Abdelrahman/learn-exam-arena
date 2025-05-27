
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Save, Mail, Phone } from "lucide-react";

const DoctorSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: "",
    bio: "",
    office: "",
    officeHours: "",
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    examReminders: true,
    gradeNotifications: false,
    studentMessages: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="office">Office Location</Label>
                <Input
                  id="office"
                  value={profile.office}
                  onChange={(e) => setProfile({...profile, office: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about yourself..."
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="officeHours">Office Hours</Label>
              <Input
                id="officeHours"
                placeholder="e.g., Monday-Friday 2:00-4:00 PM"
                value={profile.officeHours}
                onChange={(e) => setProfile({...profile, officeHours: e.target.value})}
              />
            </div>
            <Button onClick={handleSaveProfile}>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
                </div>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Exam Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminded about upcoming exams</p>
              </div>
              <Switch
                checked={notifications.examReminders}
                onCheckedChange={(checked) => setNotifications({...notifications, examReminders: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Grade Notifications</Label>
                <p className="text-sm text-muted-foreground">Notifications when grades are submitted</p>
              </div>
              <Switch
                checked={notifications.gradeNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, gradeNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Student Messages</Label>
                <p className="text-sm text-muted-foreground">Notifications for messages from students</p>
              </div>
              <Switch
                checked={notifications.studentMessages}
                onCheckedChange={(checked) => setNotifications({...notifications, studentMessages: checked})}
              />
            </div>
            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Enable Two-Factor Authentication
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorSettings;
