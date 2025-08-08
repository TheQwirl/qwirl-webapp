"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserCard, { UserCardLoading } from "@/components/user-card";
import { Users, BookOpen, TrendingUp, Plus } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

const ProfileSidebar = () => {
  // Mock data - replace with actual API calls
  const suggestedUsers = [
    {
      id: 1,
      name: "Alice Johnson",
      username: "alice_j",
      avatar: null,
      mutualFriends: 5,
      isFollowing: false,
    },
    {
      id: 2,
      name: "Bob Smith",
      username: "bob_smith",
      avatar: null,
      mutualFriends: 3,
      isFollowing: false,
    },
    {
      id: 3,
      name: "Carol Davis",
      username: "carol_d",
      avatar: null,
      mutualFriends: 8,
      isFollowing: true,
    },
  ];

  const trendingQwirls = [
    {
      id: 1,
      title: "Tech Trends 2024",
      author: "TechGuru",
      participants: 1234,
    },
    {
      id: 2,
      title: "Movie Preferences",
      author: "FilmBuff",
      participants: 856,
    },
    {
      id: 3,
      title: "Food Adventures",
      author: "Foodie",
      participants: 642,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Suggested Users */}
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          {suggestedUsers.map((user) => (
            <UserCard key={user.id} user={user} variant="suggestion" />
          ))}
          <Button variant="ghost" className="w-full text-sm">
            See all suggestions
          </Button>
        </CardContent>
      </Card>

      {/* Trending Qwirls */}
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Qwirls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingQwirls.map((qwirl) => (
            <div
              key={qwirl.id}
              className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <h4 className="font-medium text-sm">{qwirl.title}</h4>
              <p className="text-xs text-gray-600 mt-1">by {qwirl.author}</p>
              <p className="text-xs text-gray-500 mt-1">
                {qwirl.participants.toLocaleString()} participants
              </p>
            </div>
          ))}
          <Button
            icon={BookOpen}
            iconPlacement="left"
            variant="ghost"
            className="w-full text-sm"
          >
            Explore more Qwirls
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            icon={Plus}
            iconPlacement="left"
            variant="outline"
            className="w-full justify-start text-sm"
          >
            Create new Qwirl
          </Button>
          <Button
            icon={Users}
            iconPlacement="left"
            variant="outline"
            className="w-full justify-start text-sm"
          >
            Find friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export const ProfileSidebarLoading = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            People you may know
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            // <UserCard key={index}  />
            <UserCardLoading key={index} variant="suggestion" />
          ))}
          <Button variant="ghost" className="w-full text-sm">
            See all suggestions
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Qwirls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* <h4 className="font-medium text-sm">{qwirl.title}</h4>
              <p className="text-xs text-gray-600 mt-1">by {qwirl.author}</p>
              <p className="text-xs text-gray-500 mt-1">
                {qwirl.participants.toLocaleString()} participants
              </p> */}
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-1" />
            </div>
          ))}
          <Button
            icon={BookOpen}
            iconPlacement="left"
            variant="ghost"
            className="w-full text-sm"
          >
            Explore more Qwirls
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            icon={Plus}
            iconPlacement="left"
            variant="outline"
            className="w-full justify-start text-sm"
          >
            Create new Qwirl
          </Button>
          <Button
            icon={Users}
            iconPlacement="left"
            variant="outline"
            className="w-full justify-start text-sm"
          >
            Find friends
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
