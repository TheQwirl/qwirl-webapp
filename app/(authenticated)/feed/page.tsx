import PostCreator from "@/components/posts/post-creator/post-creator";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import { FeedTab } from "./_components/type";
import { redirect } from "next/navigation";
import { ErrorBoundary } from "@/components/error-boundary";
import { Suspense } from "react";
import FeedPostsList, { FeedPostsLoading } from "./_components/feed-posts-list";
import FeedPostsListError from "./_components/feed-posts-list-error";
import { PageLayout } from "@/components/layout/page-layout";

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
    <PageLayout
      rightSidebar={<ProfileSidebar />}
      backNavigation={{
        title: "Feed",
        subtitle: "Check out the latest questions",
        hideBackButton: true,
      }}
    >
      <PostCreator />
      <ErrorBoundary fallback={<FeedPostsListError />}>
        <Suspense fallback={<FeedPostsLoading />} key={activeTab}>
          <FeedPostsList tab={activeTab} />
        </Suspense>
      </ErrorBoundary>
    </PageLayout>
  );
};

export default Feed;
