import { ProfileHeaderLoading } from "@/components/profile/profile-header";
import { ProfileSidebarLoading } from "@/components/profile/profile-sidebar";
import { ProfileTabsLoading } from "@/components/profile/profile-tabs";

export default function Loading() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-full lg:col-span-8">
        <ProfileHeaderLoading showWavelength />
        <div className="mt-6 pl-5 pb-10">
          <ProfileTabsLoading />
        </div>
      </div>
      <div className="col-span-full lg:col-span-4">
        <ProfileSidebarLoading />
      </div>
    </div>
  );
}
