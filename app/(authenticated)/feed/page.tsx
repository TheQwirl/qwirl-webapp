import PageHeader from "@/components/layout/page-header";
import PostCreator from "@/components/posts/post-creator/post-creator";
import clsx from "clsx";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { FeedTab } from "./_components/type";
import { redirect } from "next/navigation";
import FeedTabs from "./_components/feed-tabs";
import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";
import FeedPostsList, { FeedPostsLoading } from "./_components/feed-posts-list";
import FeedPostsListError from "./_components/feed-posts-list-error";

const Feed = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const tab = (await searchParams)?.tab;
  const activeTab: FeedTab = tab === "explore" ? "explore" : "recent";

  if (tab && !["recent", "explore"].includes(tab)) {
    redirect("/feed?tab=recent");
  }

  return (
    <div className="grid grid-cols-12  sm:mt-0 gap-6">
      <div className={clsx("col-span-full lg:col-span-8 flex flex-col h-full")}>
        <PageHeader
          pageTitle="Feed"
          pageSubTitle="Check out the latest questions"
          extraContent={<FeedTabs activeTab={activeTab} />}
        />

        <div className="pt-8">
          <PostCreator />
        </div>

        <ErrorBoundary fallback={<FeedPostsListError />}>
          <Suspense fallback={<FeedPostsLoading />} key={activeTab}>
            <FeedPostsList tab={activeTab} />
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="col-span-4">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default Feed;
