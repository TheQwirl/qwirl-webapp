import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Users } from "lucide-react";
import { Button } from "../ui/button";
import $api from "@/lib/api/client";
import UserCard, { UserCardLoading } from "../user-card";

const SuggestedPeopleCard = () => {
  const suggestedPeopleQuery = $api.useQuery(
    "get",
    "/user_follows/people-you-may-know",
    {
      params: {
        query: {
          limit: 4,
        },
      },
    }
  );

  return (
    <Card className="bg-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5" />
          People you may know
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-3">
        {suggestedPeopleQuery.isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <UserCardLoading key={index} variant="suggestion" />
            ))
          : suggestedPeopleQuery?.data?.map((data) => (
              <UserCard key={data.id} user={data} variant="suggestion" />
            ))}
        <Button variant="ghost" className="w-full text-sm">
          See all suggestions
        </Button>
      </CardContent>
    </Card>
  );
};

export default SuggestedPeopleCard;
