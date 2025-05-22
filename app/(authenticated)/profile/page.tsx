"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProfileHeader from "@/components/profile/profile-header";
import TabView from "@/components/profile/tab-view";
import QwirlTab from "@/components/profile/qwirl-tab";
import PeoplesTab from "@/components/profile/peoples-tab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 gap-6"
    >
      <div className="col-span-9">
        <ProfileHeader />
        <div className="pl-5 pb-10">
          <TabView activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "myQwirl" && <QwirlTab />}
          {activeTab === "posts" && <div>Posts content (empty for now)</div>}
          {activeTab === "myPeople" && <PeoplesTab />}
        </div>
      </div>
      <div className="col-span-3"></div>
    </motion.div>
  );
};

export default Profile;
