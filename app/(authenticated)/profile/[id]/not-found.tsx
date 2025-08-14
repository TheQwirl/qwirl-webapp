import { PageLayout } from "@/components/layout/page-layout";
import { ProfileHeaderEmpty } from "@/components/profile/profile-header";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <PageLayout rightSidebar={<ProfileSidebar />}>
      <ProfileHeaderEmpty />
      <div className="w-full flex items-center justify-center pt-8">
        <div className="flex flex-col justify-center items-center">
          <Image
            src="/assets/error-user.svg"
            alt="error user"
            width={200}
            height={200}
          />
          <h1 className="text-2xl font-bold">User not found</h1>
          <p className="text-gray-500">
            The user you are looking for does not exist or has been deleted.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default NotFound;
