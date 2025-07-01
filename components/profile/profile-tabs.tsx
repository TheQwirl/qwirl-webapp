"use client";

import React, { useState } from "react";
import TabView from "./tab-view";
import QwirlTab from "./qwirl-tab";
import PeoplesTab from "./peoples-tab";
import PostsTab from "./posts-tab";
import { components } from "@/lib/api/v1";

interface ProfileTabsProps {
  user:
    | components["schemas"]["UserResponse"]
    | components["schemas"]["UserWithRelationshipResponse"];
}
const ProfileTabs = ({ user }: ProfileTabsProps) => {
  const [activeTab, setActiveTab] = useState("posts");

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
