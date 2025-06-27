"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaApple, FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ExternalLoginButtonsProps {
  apiUrl: string;
}

export const ExternalLoginButtons = ({ apiUrl }: ExternalLoginButtonsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(
        `Login failed: ${error} - ${searchParams.get("error_detail") || ""}`
      );
      // Optionally clear the error from URL
      router.replace("/auth");
    }
    const loggedOut = searchParams.get("logged_out");
    if (loggedOut) {
      toast.success("You have been logged out successfully.");
      router.replace("/auth");
    }
  }, [searchParams, router]);

  const googleRedirect = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const redirectUrl = `${apiUrl}/api/v1/users/external-login?client_type=google`;
      router.push(redirectUrl);
    } catch (error) {
      console.error("Error during Google redirection:", error);
      toast.error("Error during Google Authentication");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        icon={FaApple}
        iconPlacement="left"
        variant="outline"
        className="w-full hover:bg-muted transition-colors duration-200"
      >
        Login with Apple
      </Button>
      <Button
        icon={FaGoogle}
        iconPlacement="left"
        onClick={googleRedirect}
        variant="outline"
        className="w-full hover:bg-muted transition-colors duration-200"
      >
        Login with Google
      </Button>
    </div>
  );
};
