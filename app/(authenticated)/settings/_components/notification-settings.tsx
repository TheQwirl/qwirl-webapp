"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Mail,
  MessageSquare,
  Heart,
  Users,
  TrendingUp,
  Smartphone,
  Monitor,
} from "lucide-react";

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [qwirlResponses, setQwirlResponses] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [qwirlLikes, setQwirlLikes] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [trendingQwirls, setTrendingQwirls] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4" />
            Email Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications via email
          </p>
        </div>
        <Switch
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
        />
      </div>

      <Separator />

      {/* Push Notifications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Smartphone className="h-4 w-4" />
            Push Notifications
          </Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications on your device
          </p>
        </div>
        <Switch
          checked={pushNotifications}
          onCheckedChange={setPushNotifications}
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Activity Notifications
        </Label>

        {/* Qwirl Responses */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="h-4 w-4" />
              New Qwirl Responses
            </Label>
            <p className="text-sm text-muted-foreground">
              When someone takes your Qwirl
            </p>
          </div>
          <Switch
            checked={qwirlResponses}
            onCheckedChange={setQwirlResponses}
            disabled={!emailNotifications && !pushNotifications}
          />
        </div>

        {/* New Followers */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4" />
              New Followers
            </Label>
            <p className="text-sm text-muted-foreground">
              When someone follows you
            </p>
          </div>
          <Switch
            checked={newFollowers}
            onCheckedChange={setNewFollowers}
            disabled={!emailNotifications && !pushNotifications}
          />
        </div>

        {/* Qwirl Likes */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Heart className="h-4 w-4" />
              Qwirl Likes & Shares
            </Label>
            <p className="text-sm text-muted-foreground">
              When someone likes or shares your Qwirl
            </p>
          </div>
          <Switch
            checked={qwirlLikes}
            onCheckedChange={setQwirlLikes}
            disabled={!emailNotifications && !pushNotifications}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Content & Updates
        </Label>

        {/* Weekly Digest */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Monitor className="h-4 w-4" />
              Weekly Activity Digest
            </Label>
            <p className="text-sm text-muted-foreground">
              Summary of your Qwirl activity and stats
            </p>
          </div>
          <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
        </div>

        {/* Trending Qwirls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Trending Qwirls
            </Label>
            <p className="text-sm text-muted-foreground">
              Discover popular Qwirls in your interests
            </p>
          </div>
          <Switch
            checked={trendingQwirls}
            onCheckedChange={setTrendingQwirls}
          />
        </div>

        {/* Marketing Emails */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Bell className="h-4 w-4" />
              Product Updates & Tips
            </Label>
            <p className="text-sm text-muted-foreground">
              New features, tips, and platform updates
            </p>
          </div>
          <Switch
            checked={marketingEmails}
            onCheckedChange={setMarketingEmails}
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end pt-4 gap-2">
        <Button className="min-w-[120px]">Save Preferences</Button>
      </div>
    </div>
  );
}
