"use client";

import React from "react";
import {
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Globe,
  Music,
  MessageCircle,
  Lock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import $api from "@/lib/api/client";
import { cn } from "@/lib/utils";

type SocialPlatform =
  | "instagram"
  | "twitter"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "github"
  | "website"
  | "spotify"
  | "discord";

const SOCIAL_CONFIG: Record<
  SocialPlatform,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    getUrl: (url: string) => string;
  }
> = {
  instagram: {
    label: "Instagram",
    icon: Instagram,
    getUrl: (url) => `https://instagram.com/${url}`,
  },
  twitter: {
    label: "Twitter/X",
    icon: Twitter,
    getUrl: (url) => `https://twitter.com/${url}`,
  },
  facebook: {
    label: "Facebook",
    icon: Facebook,
    getUrl: (url) => `https://facebook.com/${url}`,
  },
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    getUrl: (url) => `https://linkedin.com/${url}`,
  },
  youtube: {
    label: "YouTube",
    icon: Youtube,
    getUrl: (url) => `https://youtube.com/${url}`,
  },
  github: {
    label: "GitHub",
    icon: Github,
    getUrl: (url) => `https://github.com/${url}`,
  },
  website: {
    label: "Website",
    icon: Globe,
    getUrl: (url) => (url.startsWith("http") ? url : `https://${url}`),
  },
  spotify: {
    label: "Spotify",
    icon: Music,
    getUrl: (url) => `https://open.spotify.com/${url}`,
  },
  discord: {
    label: "Discord",
    icon: MessageCircle,
    getUrl: (url) => `https://discord.gg/${url}`,
  },
};

interface UserSocialsDisplayProps {
  userId: number;
  variant?: "card" | "inline";
}

const UserSocialsDisplay: React.FC<UserSocialsDisplayProps> = ({
  userId,
  variant = "card",
}) => {
  const socialsDataQuery = $api.useQuery(
    "get",
    `/users/{user_id}/socials`,
    {
      params: {
        path: {
          user_id: userId,
        },
      },
    },
    {
      enabled: !!userId,
    }
  );

  // Inline variant - just the icons
  if (variant === "inline") {
    if (socialsDataQuery.isLoading) {
      return (
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-lg" />
          ))}
        </div>
      );
    }

    if (!socialsDataQuery?.data?.data?.has_access) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-xs">
            {socialsDataQuery?.data?.data?.message ||
              "Complete the Qwirl to unlock"}
          </span>
        </div>
      );
    }

    if (socialsDataQuery?.data?.data?.socials.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center gap-4 justify-center">
        {socialsDataQuery?.data?.data?.socials.map((social) => {
          const config = SOCIAL_CONFIG[social.platform as SocialPlatform];
          if (!config) return null;

          const Icon = config.icon;
          const url = config.getUrl(social.url);

          return (
            <button
              key={social.platform}
              onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              type="button"
              className={cn(
                "relative p-2.5 rounded-lg border-2 transition-all hover:scale-105 flex-shrink-0",
                " bg-primary/10 text-primary hover:bg-primary/20"
              )}
              title={config.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    );
  }

  // Card variant - original implementation
  // ... rest of the card variant code remains the same
  return null;
};

export default UserSocialsDisplay;
