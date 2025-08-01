"use client";

import React, { useState } from "react";
import TabView from "./tab-view";
import QwirlTab from "./qwirl-tab";
import PeoplesTab from "./peoples-tab";
import PostsTab from "./posts-tab";
import { MyUser, OtherUser } from "./types";
import { ProfileProvider } from "@/contexts/ProfileForContext";
import { useSearchParams } from "next/navigation";

interface ProfileTabsProps {
  user: MyUser | OtherUser | undefined;
  profileFor: "self" | "other";
}

const ProfileTabs = ({ user, profileFor }: ProfileTabsProps) => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (tab === "myQwirl" || tab === "posts" || tab === "myPeople") {
        setActiveTab(tab);
      }
    }
  }, [tab]);

  const [activeTab, setActiveTab] = useState(
    profileFor === "self" || (user as OtherUser)?.relationship?.is_following
      ? "posts"
      : "myQwirl"
  );

  return (
    <>
      <ProfileProvider profileFor={profileFor}>
        <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "myQwirl" && (
          <QwirlTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}
        {activeTab === "posts" && (
          <PostsTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}
        {activeTab === "myPeople" && (
          <PeoplesTab
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />
        )}
      </ProfileProvider>
    </>
  );
};

export const ProfileTabsLoading = () => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-full lg:col-span-8">
        <div className="mt-6 pl-5 pb-10">
          <TabView activeTab="loading" setActiveTab={() => {}} />
          <div className="p-4 bg-gray-100 rounded-lg mt-4">
            <p className="text-gray-500">Loading profile tabs...</p>
          </div>
        </div>
      </div>
      <div className="col-span-full lg:col-span-4">
        {/* Placeholder for sidebar */}
      </div>
    </div>
  );
};

export default ProfileTabs;
