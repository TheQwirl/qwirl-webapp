import Image from "next/image";
import UserAvatar from "../user-avatar";
import CategoryList from "./category-list";

interface ProfileHeaderProps {
  headerImage?: string;
  avatar: string;
  name: string;
  username: string;
  followers: number;
  friends: number;
  categories: string[];
}

export default function ProfileHeader({
  headerImage,
  avatar,
  name,
  username,
  followers,
  friends,
  categories,
}: ProfileHeaderProps) {
  return (
    <div className="mb-8">
      <div className="relative polka-background pb-16">
        <div className="h-48 overflow-hidden">
          {headerImage ? (
            <Image
              src={headerImage}
              alt="Header"
              width={800}
              height={200}
              className="w-full object-cover"
            />
          ) : (
            <div className="h-full polka-background z-10  w-full" />
          )}
        </div>
        <div className="absolute bottom-0 px-10 translate-y-1/2">
          <div className="relative h-32 w-32">
            <div className="absolute inset-0 rounded-full bg-white shadow-md" />
            <div className="absolute inset-2 overflow-hidden rounded-full">
              <UserAvatar
                name={name}
                image={avatar}
                className="h-full w-full object-cover text-xl"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 px-10">
        <div className=" ">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-gray-600">{username}</p>
          <div className="mt-4 flex  space-x-4">
            <div>
              <span className="font-bold">{followers}</span>{" "}
              <span className="text-gray-600">Followers</span>
            </div>
            <div>
              <span className="font-bold">{friends}</span>{" "}
              <span className="text-gray-600">Friends</span>
            </div>
          </div>
        </div>
        <CategoryList categories={categories} />
      </div>
    </div>
  );
}
