"use client";
import { authStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";

const PublicNav = () => {
  const { user, isAuthenticated, isLoading } = authStore();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className=" fixed inset-x-0  ">
        <div className="rounded-none z-50 flex items-center justify-between px-8 py-5 w-full ">
          <Button
            variant="default"
            onClick={handleBack}
            icon={ArrowLeft}
            iconPlacement="left"
          >
            Back
          </Button>
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="z-50 fixed inset-x-0 ">
      <div className="rounded-none z-50 flex items-center justify-between px-8 py-5 w-full ">
        <Button
          variant="default"
          onClick={handleBack}
          icon={ArrowLeft}
          iconPlacement="left"
        >
          Back
        </Button>

        {isAuthenticated && user ? (
          <UserAvatar
            image={user.avatar ?? ""}
            name={user.name ?? ""}
            className="cursor-pointer transition-all"
          />
        ) : (
          <Link href="/auth">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PublicNav;
