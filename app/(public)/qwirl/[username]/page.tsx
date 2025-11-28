import QwirlRespond from "@/components/qwirl/qwirl-respond";
import { serverFetchClient } from "@/lib/api/server";
import { cookies } from "next/headers";
import React from "react";

const PrimaryQwirlPage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access-token")?.value;

  const userResponse = await serverFetchClient.GET(
    "/api/v1/users/username/{username}",
    {
      headers: accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : undefined,
      params: {
        path: {
          username,
        },
      },
    }
  );

  return (
    <div className="min-h-screen w-full bg-primary overflow-y-auto text-primary-foreground flex items-center justify-center pt-16 px-5 md:px-20">
      <QwirlRespond user={userResponse.data} />
    </div>
  );
};

export default PrimaryQwirlPage;
