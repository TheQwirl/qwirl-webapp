"use client";

import { useState } from "react";
import ProfileHeader from "@/components/profile/profile-header";
import TabView from "@/components/profile/tab-view";
import QwirlTab from "@/components/profile/qwirl-tab";
import PeoplesTab from "@/components/profile/peoples-tab";
import $api from "@/lib/api/client";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const userQuery = $api.useQuery("get", "/api/v1/users/me");
  const user = userQuery?.data;
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-9">
        <ProfileHeader user={user} isLoading={userQuery.isLoading} />
        <div className="pl-5 pb-10">
          <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "myQwirl" && <QwirlTab />}
          {activeTab === "posts" && <div>Posts content (empty for now)</div>}
          {activeTab === "myPeople" && <PeoplesTab />}
        </div>
      </div>
      <div className="col-span-3"></div>
    </div>
  );
};

export default Profile;
