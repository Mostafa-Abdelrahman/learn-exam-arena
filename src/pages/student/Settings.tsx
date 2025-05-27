
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, Save, GraduationCap } from "lucide-react";

const StudentSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    studentId: "",
    phone: "",
    emergencyContact: "",
  });
  const [notifications, setNotifications] = useState({
    examReminders: true,
    gradeAlerts: true,
    courseUpdates: false,
    emailNotifications: true,
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showGrades: false,
    allowMessages: true,
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

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy Settings Updated",
      description: "Your privacy preferences have been saved.",
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
            <CardDescription>Update your personal information</CardDescription>
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
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  value={profile.studentId}
                  onChange={(e) => setProfile({...profile, studentId: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                placeholder="Name and phone number"
                value={profile.emergencyContact}
                onChange={(e) => setProfile({...profile, emergencyContact: e.target.value})}
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
                <Label>Grade Alerts</Label>
                <p className="text-sm text-muted-foreground">Notifications when new grades are posted</p>
              </div>
              <Switch
                checked={notifications.gradeAlerts}
                onCheckedChange={(checked) => setNotifications({...notifications, gradeAlerts: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Course Updates</Label>
                <p className="text-sm text-muted-foreground">Updates about course materials and announcements</p>
              </div>
              <Switch
                checked={notifications.courseUpdates}
                onCheckedChange={(checked) => setNotifications({...notifications, courseUpdates: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                checked={notifications.emailNotifications}
                onCheckedChange={(checked) => setNotifications({...notifications, emailNotifications: checked})}
              />
            </div>
            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Privacy Settings
            </CardTitle>
            <CardDescription>Control your privacy and visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">Allow other students to see your profile</p>
              </div>
              <Switch
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => setPrivacy({...privacy, profileVisible: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Show Grades</Label>
                <p className="text-sm text-muted-foreground">Display your grades on your profile</p>
              </div>
              <Switch
                checked={privacy.showGrades}
                onCheckedChange={(checked) => setPrivacy({...privacy, showGrades: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Messages</Label>
                <p className="text-sm text-muted-foreground">Allow other students to message you</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={(checked) => setPrivacy({...privacy, allowMessages: checked})}
              />
            </div>
            <Button onClick={handleSavePrivacy}>
              <Save className="mr-2 h-4 w-4" />
              Save Privacy Settings
            </Button>
          </CardContent>
        </Card>

        {/* Academic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Academic Preferences
            </CardTitle>
            <CardDescription>Configure your academic settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Download Academic Transcript
            </Button>
            <Button variant="outline">
              Export Grade History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentSettings;
