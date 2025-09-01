"use client";

import React, { Suspense, useState } from "react";
import TabView from "./tab-view";
import QwirlTab from "./qwirl-tab";
import PeoplesTab from "./peoples-tab";
import PostsTab, { PostsTabLoading } from "./posts-tab";
import { ErrorBoundary } from "../error-boundary";
import { PostComponentLoading } from "../posts/post-component";
import { useProfileStore } from "@/stores/profile-store";
import { Card } from "../ui/card";

const ProfileTabs = () => {
  const { profileFor, user } = useProfileStore();

  const getDefaultTab = () => {
    if (profileFor === "self") {
      return "myQwirl";
    }
    return user?.relationship?.is_following ? "myQwirl" : "myQwirl";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  return (
    <Card className="p-4 bg-transparent">
      <TabView activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === "myQwirl" && <QwirlTab />}
      {activeTab === "posts" && (
        <ErrorBoundary>
          <Suspense fallback={<PostsTabLoading />}>
            <PostsTab />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeTab === "myPeople" && <PeoplesTab />}
    </Card>
  );
};

export const ProfileTabsLoading = () => {
  return (
    <>
      <TabView activeTab="myQwirl" onTabChange={() => {}} />
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostComponentLoading key={index} />
        ))}
      </div>
    </>
  );
};

export default ProfileTabs;
