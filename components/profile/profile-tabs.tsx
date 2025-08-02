"use client";

import React, { Suspense, useState } from "react";
import TabView from "./tab-view";
import QwirlTab from "./qwirl-tab";
import PeoplesTab from "./peoples-tab";
import PostsTab, { PostsTabLoading } from "./posts-tab";
import { MyUser, OtherUser } from "./types";
import { ProfileProvider } from "@/contexts/ProfileForContext";
import { useSearchParams } from "next/navigation";
import { PostComponentLoading } from "../posts/post-component";
import { ErrorBoundary } from "../error-boundary";

type ProfileTabsProps =
  | { profileFor: "self"; user: MyUser | undefined }
  | { profileFor: "other"; user: OtherUser | undefined };

const ProfileTabs = (props: ProfileTabsProps) => {
  const { profileFor, user } = props;
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(() => {
    if (profileFor === "self") return "posts";
    return user?.relationship?.is_following ? "posts" : "myQwirl";
  });

  React.useEffect(() => {
    if (tab === "myQwirl" || tab === "posts" || tab === "myPeople") {
      setActiveTab(tab);
    }
  }, [tab]);

  const tabComponents = (
    <>
      <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "myQwirl" && <QwirlTab />}
      {activeTab === "posts" && (
        <ErrorBoundary>
          <Suspense fallback={<PostsTabLoading />}>
            <PostsTab />
          </Suspense>
        </ErrorBoundary>
      )}
      {activeTab === "myPeople" && <PeoplesTab />}
    </>
  );

  if (profileFor === "self") {
    return (
      <ProfileProvider profileFor="self" user={user}>
        {tabComponents}
      </ProfileProvider>
    );
  }

  return (
    <ProfileProvider profileFor="other" user={user}>
      {tabComponents}
    </ProfileProvider>
  );
};

export const ProfileTabsLoading = () => {
  return (
    <>
      <TabView activeTab="posts" setActiveTab={() => {}} />
      <div className="space-y-4 mt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <PostComponentLoading key={index} />
        ))}
      </div>
    </>
  );
};

export default ProfileTabs;
