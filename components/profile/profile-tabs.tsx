"use client";

import React, { useState } from "react";
import TabView from "./tab-view";
import QwirlTab from "./qwirl-tab";
import PeoplesTab from "./peoples-tab";
import PostsTab from "./posts-tab";
import { MyUser, OtherUser } from "./types";

interface ProfileTabsProps {
  user: MyUser | OtherUser | undefined;
  profileFor: "self" | "other";
}
const ProfileTabs = ({ user, profileFor }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState(
    profileFor === "self" || (user as OtherUser)?.relationship?.is_following
      ? "posts"
      : "myQwirl"
  );

  return (
    <>
      <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "myQwirl" && <QwirlTab user={user} />}
      {activeTab === "posts" && <PostsTab user={user} />}
      {activeTab === "myPeople" && <PeoplesTab user={user} />}
    </>
  );
};

export default ProfileTabs;
