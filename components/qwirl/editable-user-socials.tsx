"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import $api from "@/lib/api/client";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { useForm, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { components } from "@/lib/api/v1";

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

interface SocialFormData {
  socials: components["schemas"]["GetSocialsResponse"]["data"]["socials"];
}

const SOCIAL_PLATFORMS: Array<{
  id: SocialPlatform;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
}> = [
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    placeholder: "instagram.com/",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    icon: Twitter,
    placeholder: "twitter.com/",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    placeholder: "facebook.com/",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "linkedin.com/",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    placeholder: "youtube.com/",
  },
  {
    id: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "github.com/",
  },
  {
    id: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://",
  },
  {
    id: "spotify",
    label: "Spotify",
    icon: Music,
    placeholder: "open.spotify.com/",
  },
  {
    id: "discord",
    label: "Discord",
    icon: MessageCircle,
    placeholder: "discord.gg/",
  },
];

const EditableUserSocials: React.FC = () => {
  const { data, isLoading } = $api.useQuery("get", "/users/me/socials");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, boolean>
  >({});
  const updateSocialsMutation = $api.useMutation("put", "/users/me/socials", {
    onSuccess: () => {
      toast.success("Social links saved", {
        description: "Your social links have been updated",
      });
      reset(getValues());
    },
    onError: () => {
      toast.error("Failed to save", {
        description: "Please try again",
      });
    },
  });

  const { control, setValue, getValues, reset, formState } =
    useForm<SocialFormData>({
      defaultValues: {
        socials: SOCIAL_PLATFORMS.map((platform) => ({
          platform: platform.id,
          url: "",
          is_visible: false,
        })),
      },
    });

  const socials = useWatch({ control, name: "socials" });

  const VISIBLE_ICONS_COUNT = 5;

  useEffect(() => {
    if (data?.data?.socials && data.data.socials.length > 0) {
      const socialsMap = new Map(data.data.socials.map((s) => [s.platform, s]));

      const initializedSocials = SOCIAL_PLATFORMS.map((platform) => ({
        platform: platform.id,
        url: socialsMap.get(platform.id)?.url || "",
        is_visible: socialsMap.get(platform.id)?.is_visible || false,
      }));

      reset({ socials: initializedSocials });
    }
  }, [data?.data?.socials, reset]);

  const visibleSocials = useMemo(
    () => socials.filter((s) => s.is_visible),
    [socials]
  );

  const canSelectMore = visibleSocials.length < 5;

  const visiblePlatforms = useMemo(
    () => SOCIAL_PLATFORMS.slice(0, VISIBLE_ICONS_COUNT),
    []
  );

  const overflowPlatforms = useMemo(
    () => SOCIAL_PLATFORMS.slice(VISIBLE_ICONS_COUNT),
    []
  );

  const handleToggleVisibility = (platform: SocialPlatform) => {
    const socialIndex = socials.findIndex((s) => s.platform === platform);
    if (socialIndex === -1) return;

    const currentSocial = socials[socialIndex];
    if (!currentSocial) return;

    if (currentSocial.is_visible) {
      setValue(`socials.${socialIndex}.is_visible`, false, {
        shouldDirty: true,
      });
    } else if (canSelectMore) {
      setValue(`socials.${socialIndex}.is_visible`, true, {
        shouldDirty: true,
      });
    } else {
      toast.error("Maximum 5 socials", {
        description: "Hide one social to add another",
      });
    }
  };

  const handleSubmit = async () => {
    // Clear previous validation errors
    setValidationErrors({});

    // Validate visible socials have non-empty URLs
    const errors: Record<string, boolean> = {};
    socials.forEach((social) => {
      if (social.is_visible && social.url.trim() === "") {
        errors[social.platform] = true;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const socialsToSave = socials.filter((s) => s.url.trim() !== "");
    await updateSocialsMutation.mutateAsync({
      body: {
        socials: socialsToSave,
      },
    });
  };

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Social Links</CardTitle>
          <CardDescription className="text-xs">
            Share your socials with people who complete your Qwirl.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Social Links</CardTitle>
        <CardDescription className="text-xs">
          Share your socials with people who complete your Qwirl. Select up to 5
          platforms to display. Links are saved even when hidden.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Visible Platforms
            </label>
            <span className="text-xs text-muted-foreground">
              {visibleSocials.length}/5 selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {visiblePlatforms.map((platform) => {
              const social = socials.find((s) => s.platform === platform.id);
              const isVisible = social?.is_visible || false;
              const Icon = platform.icon;

              return (
                <button
                  key={platform.id}
                  onClick={() => handleToggleVisibility(platform.id)}
                  type="button"
                  className={cn(
                    "relative p-2.5 rounded-lg border-2 transition-all hover:scale-105 flex-shrink-0",
                    isVisible
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-gray-200 bg-white text-gray-400 hover:border-gray-300",
                    !isVisible &&
                      !canSelectMore &&
                      "opacity-50 cursor-not-allowed hover:scale-100"
                  )}
                  title={platform.label}
                  disabled={!isVisible && !canSelectMore}
                >
                  <Icon className="h-5 w-5" />
                  {isVisible && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-white" />
                  )}
                </button>
              );
            })}

            {overflowPlatforms.length > 0 && (
              <Select
                value=""
                onValueChange={(value) => {
                  handleToggleVisibility(value as SocialPlatform);
                }}
              >
                <SelectTrigger
                  className={cn(
                    "w-auto relative h-auto p-2.5 rounded-lg border-2 transition-all hover:scale-105 flex-shrink-0",
                    "border-gray-200 bg-white text-gray-400 hover:border-gray-300"
                  )}
                >
                  <Plus className="h-5 w-5" />
                  {overflowPlatforms.some((platform) => {
                    const social = socials.find(
                      (s) => s.platform === platform.id
                    );
                    return social?.is_visible;
                  }) && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-white" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {overflowPlatforms.map((platform) => {
                    const social = socials.find(
                      (s) => s.platform === platform.id
                    );
                    const isVisible = social?.is_visible || false;
                    const Icon = platform.icon;

                    return (
                      <SelectItem
                        key={platform.id}
                        value={platform.id}
                        disabled={!isVisible && !canSelectMore}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          <span>{platform.label}</span>
                          {isVisible && (
                            <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Toggling off a platform hides it from others but keeps your link
            saved
          </p>
        </div>

        {visibleSocials.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Profile Links
            </label>
            <div className="space-y-3">
              {visibleSocials.map((social) => {
                const platform = SOCIAL_PLATFORMS.find(
                  (p) => p.id === social.platform
                );
                if (!platform) return null;

                const Icon = platform.icon;
                const socialIndex = socials.findIndex(
                  (s) => s.platform === social.platform
                );
                const hasError = validationErrors[social.platform];

                return (
                  <div key={social.platform} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <InputGroup
                        className={cn(
                          "!bg-input !border",
                          hasError && "!border-destructive"
                        )}
                      >
                        <InputGroupInput
                          value={social.url}
                          onChange={(e) => {
                            if (socialIndex !== -1) {
                              setValue(
                                `socials.${socialIndex}.url`,
                                e.target.value,
                                { shouldDirty: true }
                              );
                              // Clear error when user starts typing
                              if (validationErrors[social.platform]) {
                                setValidationErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[social.platform];
                                  return newErrors;
                                });
                              }
                            }
                          }}
                          placeholder={platform.placeholder}
                          className="flex-1"
                        />
                        <InputGroupAddon>
                          <Icon className="h-3.5 w-3.5" />
                        </InputGroupAddon>
                      </InputGroup>
                    </div>
                    {hasError && (
                      <p className="text-xs text-destructive">
                        URL is required for visible platforms
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {visibleSocials.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No platforms selected</p>
            <p className="text-xs mt-1">
              Click on icons above to add your social links
            </p>
          </div>
        )}
      </CardContent>

      <div className="p-4 pt-4 border-t">
        <Button
          onClick={handleSubmit}
          disabled={!formState.isDirty || updateSocialsMutation.isPending}
          className="w-full"
          loading={updateSocialsMutation.isPending}
        >
          {updateSocialsMutation.isPending ? "Saving..." : "Save Social Links"}
        </Button>
      </div>
    </Card>
  );
};

export default EditableUserSocials;
