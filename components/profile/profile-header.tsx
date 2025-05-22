import UserAvatar from "../user-avatar";
import CategoryList from "./category-list";
import WavelengthIndicator from "../wavelength-indicator";
import { Button } from "../ui/button";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { DialogUpdateUser } from "./dialog-update-user";
import $api from "@/lib/api/client";
import { Skeleton } from "../ui/skeleton";
import { FaPlus } from "react-icons/fa6";

export default function ProfileHeader() {
  const userQuery = $api.useQuery("get", "/api/v1/users/me");
  const user = userQuery?.data;
  const [openUpdateUserDialog, setOpenUpdateUserDialog] = useState(false);

  return (
    <>
      <div className="mb-8">
        <div className="relative polka-background pb-16 rounded-3xl">
          <div className="h-48 overflow-hidden">
            {/* {headerImage ? (
            <Image
              src={headerImage}
              alt="Header"
              width={800}
              height={200}
              className="w-full object-cover"
            />
          ) : (
            <div className="h-full polka-background rounded-t-xl  z-10  w-full" />
          )} */}
            <div className="h-full polka-background rounded-t-xl  z-10  w-full" />
          </div>
          <div className="absolute bottom-0 pl-4 translate-y-[30%]">
            {userQuery?.isLoading ? (
              <Skeleton className="h-32 w-32 rounded-full" />
            ) : (
              <div className="relative h-32 w-32">
                <div className="absolute inset-0 rounded-full bg-white shadow-md" />
                <div className="absolute inset-2 overflow-hidden rounded-full">
                  <UserAvatar
                    name={user?.name ?? "Name Unavailable"}
                    image={user?.avatar ?? ""}
                    className="h-full w-full object-cover text-xl"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setOpenUpdateUserDialog(true)}
              className=" hover:bg-white/100"
            >
              <MdEdit className="text-xl" />
            </Button>
          </div>
        </div>
        <div className="mt-12 pl-4">
          <div className="flex justify-between">
            {userQuery?.isLoading ? (
              <div className="">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-6 w-24 mt-2 rounded-full" />
                <div className="mt-4 flex  space-x-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
              </div>
            ) : (
              <div className=" ">
                <h1 className="text-2xl font-bold">{user?.name}</h1>
                <p className="text-gray-500">@{user?.username}</p>
                <div className="mt-4 flex  space-x-4">
                  <div>
                    <span className="font-bold">{user?.followers_count}</span>{" "}
                    <span className="text-gray-500">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{user?.friends_count}</span>{" "}
                    <span className="text-gray-500">Friends</span>
                  </div>
                </div>
                <CategoryList categories={user?.categories ?? []} />
              </div>
            )}
            <div className="flex flex-col gap-4 justify-between h-full">
              {true ? (
                <div className="flex items-center gap-4 justify-end">
                  <Button
                    variant="outline"
                    effect="ringHover"
                    icon={FaPlus}
                    iconPlacement="left"
                    className="rounded-full border-black/50 bg-white"
                  >
                    Follow
                  </Button>
                </div>
              ) : (
                <WavelengthIndicator wavelength={1} />
              )}
            </div>
          </div>
        </div>
      </div>
      <DialogUpdateUser
        open={openUpdateUserDialog}
        onOpenChange={(open: boolean) => setOpenUpdateUserDialog(open)}
      />
    </>
  );
}
