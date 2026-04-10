import CampusSidebar from "@/components/CampusSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, MapPin, Clock } from "lucide-react";

const Settings = () => {
  return (
    <div className="flex min-h-screen">
      <CampusSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <DashboardHeader />
        <Badge variant="outline" className="mb-4 text-xs text-muted-foreground border-border">
          System Settings
        </Badge>

        <div className="max-w-2xl space-y-6">
          {/* QR & Security Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h2 className="text-foreground font-semibold">Security & QR Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">QR Auto-Refresh</Label>
                  <p className="text-muted-foreground text-xs">Regenerate QR code every 45 seconds</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Refresh Interval (seconds)</Label>
                <Input type="number" defaultValue="45" className="mt-1 bg-secondary border-border w-32" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">HMAC Token Signing</Label>
                  <p className="text-muted-foreground text-xs">Cryptographic verification of QR tokens</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Geofencing */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="text-foreground font-semibold">GPS & Geofencing</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">GPS Verification</Label>
                  <p className="text-muted-foreground text-xs">Verify student location during attendance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Default Geofence Radius (metres)</Label>
                <Input type="number" defaultValue="75" className="mt-1 bg-secondary border-border w-32" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Max GPS Accuracy Threshold (metres)</Label>
                <Input type="number" defaultValue="100" className="mt-1 bg-secondary border-border w-32" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-foreground font-semibold">Notifications</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Proxy Alert Notifications</Label>
                  <p className="text-muted-foreground text-xs">Get notified when proxy attempts are detected</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-foreground">Low Attendance Alerts</Label>
                  <p className="text-muted-foreground text-xs">Alert students below 75% attendance</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          {/* Session Defaults */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-foreground font-semibold">Session Defaults</h2>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-muted-foreground text-sm">Default Session Duration (minutes)</Label>
                <Input type="number" defaultValue="60" className="mt-1 bg-secondary border-border w-32" />
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Confidence Score Threshold</Label>
                <Input type="number" defaultValue="50" className="mt-1 bg-secondary border-border w-32" />
                <p className="text-muted-foreground text-xs mt-1">Below this score → auto-flag as proxy</p>
              </div>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Save Settings</Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
