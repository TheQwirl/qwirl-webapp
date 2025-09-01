import { PageLayout } from "@/components/layout/page-layout";
import { ProfileHeaderLoading } from "@/components/profile/profile-header";
import { ProfileSidebarLoading } from "@/components/profile/profile-sidebar";
import { ProfileTabsLoading } from "@/components/profile/profile-tabs";

export default function Loading() {
  return (
    <PageLayout
      rightSidebar={<ProfileSidebarLoading />}
      backNavigation={{ title: "My Profile" }}
    >
      <ProfileHeaderLoading />
      <div className="mt-6 pl-5 pb-10">
        <ProfileTabsLoading />
      </div>
    </PageLayout>
  );
}
