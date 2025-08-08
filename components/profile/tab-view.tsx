"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabViewProps {
  activeTab: string;
  onTabChange?: (tabValue: string) => void;
}

export default function TabView({ activeTab, onTabChange }: TabViewProps) {
  const handleTabChange = (tabValue: string) => {
    onTabChange?.(tabValue);
  };

  return (
    <div className="mb-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="myQwirl">My Qwirl</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="myPeople">My People</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
