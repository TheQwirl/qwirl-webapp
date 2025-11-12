import { PageLayout } from "@/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Zap, Bell, Settings as SettingsIcon } from "lucide-react";
import React from "react";
import { UserPersonalSettings } from "./_components/user-personal-settings";
import { QwirlSettings } from "./_components/qwirl-settings";
import { NotificationSettings } from "./_components/notification-settings";
import { AccountSettings } from "./_components/account-settings";

const Settings = () => {
  return (
    <PageLayout
      backNavigation={{
        title: "Settings",
        hideBackButton: true,
        subtitle: "Manage your account and preferences",
        rightContent: null,
      }}
    >
      <div className=" pb-8 px-2 sm:px-4">
        <Tabs
          defaultValue="personal"
          className="flex flex-col md:flex-row gap-4 md:gap-6 items-start w-full"
        >
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 shrink-0 mb-4 md:mb-0">
            <TabsList className="flex md:flex-col flex-row gap-1 w-full h-fit bg-muted/30 p-2 border border-border/50 rounded-lg overflow-x-auto scrollbar-hide md:overflow-visible">
              <TabsTrigger
                value="personal"
                className="w-full justify-start gap-3 py-3 px-3 rounded-md text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm hover:bg-muted/50"
              >
                <User className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Personal Information</span>
                <span className="sm:hidden">Personal</span>
              </TabsTrigger>
              <TabsTrigger
                value="qwirl"
                disabled
                className="w-full justify-between gap-3 py-3 px-3 rounded-md text-sm font-medium transition-all "
              >
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Qwirl Preferences</span>
                  <span className="sm:hidden">Qwirl</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[8px] p-1 py-0 z-10 shrink-0"
                >
                  Coming Soon
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                disabled
                className="w-full justify-between gap-3 py-3 px-3 rounded-md text-sm font-medium transition-all "
              >
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Notifications</span>
                  <span className="sm:hidden">Notify</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[8px] p-1 py-0 z-10 shrink-0"
                >
                  Coming Soon
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                disabled
                className="w-full justify-between gap-3 py-3 px-3 rounded-md text-sm font-medium transition-all "
              >
                <div className="flex items-center gap-3">
                  <SettingsIcon className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Account Settings</span>
                  <span className="sm:hidden">Account</span>
                </div>
                <Badge
                  variant="secondary"
                  className="text-[8px] p-1 py-0 z-10 shrink-0"
                >
                  Coming Soon
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            <TabsContent value="personal" className="mt-0">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Update your personal details and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserPersonalSettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="qwirl" className="mt-0">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Qwirl Preferences</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Configure how your Qwirls behave and appear to others
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QwirlSettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettings />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="account" className="mt-0">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Account Settings</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your account security and data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AccountSettings />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Settings;
