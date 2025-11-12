"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Clock,
  Users,
  BarChart3,
  Shield,
  Palette,
  Globe,
  Lock,
} from "lucide-react";

export function QwirlSettings() {
  const [defaultVisibility, setDefaultVisibility] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [requireLogin, setRequireLogin] = useState(true);
  const [defaultTheme, setDefaultTheme] = useState("default");
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="space-y-6">
      {/* Default Visibility */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Eye className="h-4 w-4" />
            Default Qwirl Visibility
          </Label>
          <p className="text-sm text-muted-foreground">
            New Qwirls will be {defaultVisibility ? "public" : "private"} by
            default
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={defaultVisibility}
            onCheckedChange={setDefaultVisibility}
          />
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <Separator />

      {/* Anonymous Responses */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Users className="h-4 w-4" />
            Allow Anonymous Responses
          </Label>
          <p className="text-sm text-muted-foreground">
            Let people take your Qwirls without signing up
          </p>
        </div>
        <Switch checked={allowAnonymous} onCheckedChange={setAllowAnonymous} />
      </div>

      <Separator />

      {/* Show Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <BarChart3 className="h-4 w-4" />
            Show Response Statistics
          </Label>
          <p className="text-sm text-muted-foreground">
            Display answer distribution to Qwirl takers
          </p>
        </div>
        <Switch checked={showStats} onCheckedChange={setShowStats} />
      </div>

      <Separator />

      {/* Require Login for Responses */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Shield className="h-4 w-4" />
            Require Login for Responses
          </Label>
          <p className="text-sm text-muted-foreground">
            Only logged-in users can take your Qwirls
          </p>
        </div>
        <Switch checked={requireLogin} onCheckedChange={setRequireLogin} />
      </div>

      <Separator />

      {/* Auto-save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Auto-save Qwirl Changes</Label>
          <p className="text-sm text-muted-foreground">
            Automatically save your work as you edit
          </p>
        </div>
        <Switch checked={autoSave} onCheckedChange={setAutoSave} />
      </div>

      <Separator />

      {/* Auto Archive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            Auto-archive Old Qwirls
          </Label>
          <p className="text-sm text-muted-foreground">
            Automatically archive Qwirls with no activity for 6 months
          </p>
        </div>
        <Switch checked={autoArchive} onCheckedChange={setAutoArchive} />
      </div>

      <Separator />

      {/* Default Theme */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <Palette className="h-4 w-4" />
          Default Qwirl Theme
        </Label>
        <Select value={defaultTheme} onValueChange={setDefaultTheme}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="colorful">Colorful</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose the default visual style for your new Qwirls
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-end pt-4 gap-2">
        <Button className="min-w-[120px]">Save Preferences</Button>
      </div>
    </div>
  );
}
