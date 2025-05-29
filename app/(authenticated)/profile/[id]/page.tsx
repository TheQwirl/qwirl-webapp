// import PeoplesTab from "@/components/profile/peoples-tab";
import ProfileHeader from "@/components/profile/profile-header";
import { fetchClient } from "@/lib/api/client";
import { safeToNumber } from "@/lib/utils";
// import QwirlTab from "@/components/profile/qwirl-tab";
// import TabView from "@/components/profile/tab-view";
// import { useState } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // const [activeTab, setActiveTab] = useState("posts");

  const { id } = await params;

  const userResponse = await fetchClient.GET("/api/v1/users/{user_id}", {
    params: {
      path: {
        user_id: safeToNumber(id, null) ?? 0,
      },
    },
  });
  const user = userResponse.data;
  console.log("user:", userResponse);
  return (
    <h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-9">
          <ProfileHeader user={user} isLoading={!user} />
          <div className="pl-5 pb-10">
            {/* <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "myQwirl" && <QwirlTab />}
            {activeTab === "posts" && <div>Posts content (empty for now)</div>}
            {activeTab === "myPeople" && <PeoplesTab />} */}
          </div>
        </div>
        <div className="col-span-3"></div>
      </div>
    </h1>
  );
}
