"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon } from "lucide-react"; // Renamed to avoid conflict with component name
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline flex items-center gap-2">
        <SettingsIcon className="h-8 w-8 text-primary" /> Application Settings
      </h1>
      <Card className="max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your Yala Exchange experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              <Switch id="email-notifications" defaultChecked />
              <Label htmlFor="email-notifications">Email Notifications</Label>
            </div>
            <p className="text-sm text-muted-foreground">Receive updates about your account and transactions via email.</p>
            <div className="flex items-center space-x-2">
              <Switch id="push-notifications" />
              <Label htmlFor="push-notifications">Push Notifications (Coming Soon)</Label>
            </div>
             <p className="text-sm text-muted-foreground">Get real-time alerts on your device.</p>
          </div>
          
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
