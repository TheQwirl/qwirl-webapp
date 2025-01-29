import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface UserCardProps {
  avatar: string;
  name: string;
  username: string;
  isFollowing: boolean;
}

export default function UserCard({
  avatar,
  name,
  username,
  isFollowing,
}: UserCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center space-x-4 p-4">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={name}
          width={50}
          height={50}
          className="rounded-full"
        />
        <div className="flex-grow">
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{username}</p>
        </div>
        <div className="flex flex-col space-y-2">
          {isFollowing ? (
            <Button variant="outline">View Profile</Button>
          ) : (
            <>
              <Button variant="outline">Follow</Button>
              <Button>Qwirl</Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
