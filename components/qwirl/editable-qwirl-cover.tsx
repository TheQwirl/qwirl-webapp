"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import {
  Edit3,
  Camera,
  X,
  ImageIcon as ImageIconLucide,
  LinkIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadDialog from "@/components/image-upload-dialog";
import { cn } from "@/lib/utils";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";
import QwirlCover, { QwirlCoverSkeleton } from "./qwirl-cover";
import Link from "next/link";

// Zod schema for form validation
const qwirlHeaderSchema = z.object({
  name: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be less than 60 characters"),
  description: z
    .string()
    .max(100, "Description must be less than 100 characters")
    .optional(),
  background_image: z.string().nullable().optional(),
});

type QwirlHeaderFormData = z.infer<typeof qwirlHeaderSchema>;

interface EditableQwirlCoverProps {
  className?: string;
  isProfile?: boolean;
}

const EditableQwirlCover: React.FC<EditableQwirlCoverProps> = ({
  className,
  isProfile = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const user = authStore((state) => state.user);

  const qwirlQuery = $api.useQuery("get", "/qwirl/me", {
    enabled: !!user?.primary_qwirl_id,
  });

  const qwirlCoverQuery = $api.useQuery(
    "get",
    "/qwirl/{qwirl_id}/cover",
    {
      params: {
        path: {
          qwirl_id: user?.primary_qwirl_id ?? 0,
        },
      },
    },
    { enabled: !!user?.primary_qwirl_id }
  );

  const qwirlCoverMutation = $api.useMutation(
    "patch",
    "/qwirl/{qwirl_id}/cover",
    {
      onSuccess: () => {
        toast.success("Qwirl cover updated successfully!");
        setIsEditing(false);
        qwirlCoverQuery.refetch();
      },
      onError: (error) => {
        toast.error("Failed to update Qwirl cover. Please try again.");
        console.error("Error updating cover:", error);
      },
    }
  );

  const qwirlCoverData = qwirlCoverQuery.data;
  const isLoading = qwirlCoverQuery.isLoading || qwirlQuery.isLoading;

  const getDefaultValues = useCallback(
    (): QwirlHeaderFormData => ({
      name: qwirlCoverData?.name || qwirlCoverData?.title || "Not specified",
      description: qwirlCoverData?.description ?? "",
      background_image: qwirlCoverData?.background_image || null,
    }),
    [qwirlCoverData]
  );

  const form = useForm<QwirlHeaderFormData>({
    resolver: zodResolver(qwirlHeaderSchema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    if (!isEditing && (qwirlCoverData || user)) {
      form.reset(getDefaultValues());
    }
  }, [isEditing, qwirlCoverData, user, form, getDefaultValues]);

  const handleSave = async (data: QwirlHeaderFormData) => {
    if (!user?.primary_qwirl_id) return;
    await qwirlCoverMutation.mutateAsync({
      body: data,
      params: { path: { qwirl_id: user.primary_qwirl_id } },
    });
  };

  const handleCancel = () => {
    form.reset(getDefaultValues());
    setIsEditing(false);
  };

  const handleEdit = () => {
    form.reset(getDefaultValues());
    setIsEditing(true);
  };

  const handleImageSave = async (base64String: string) => {
    form.setValue("background_image", base64String);
  };

  const handleRemoveImage = () => {
    form.setValue("background_image", null);
  };

  if (isLoading) {
    return (
      <QwirlCoverSkeleton
        className={cn("max-w-2xl mx-auto w-full", className)}
      />
    );
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("max-w-2xl mx-auto w-full", className)}
      >
        <Card className="relative overflow-hidden border-2 border-primary/30">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSave)}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Edit Qwirl Cover</h3>
                  <Link className="text-xs" href={"/settings"}>
                    <Button
                      variant="ghost"
                      size={"xs"}
                      icon={LinkIcon}
                      iconPlacement="left"
                      className="px-1"
                    >
                      Other Settings
                    </Button>
                  </Link>
                </div>

                <FormField
                  control={form.control}
                  name="background_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Image</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {field.value ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                              <Image
                                src={field.value}
                                alt="Background preview"
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8"
                                onClick={handleRemoveImage}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full h-32 !border"
                              onClick={() => setIsImageDialogOpen(true)}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <ImageIconLucide className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                  Upload Background Image
                                </span>
                              </div>
                            </Button>
                          )}
                          {field.value && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              icon={Camera}
                              iconPlacement="left"
                              onClick={() => setIsImageDialogOpen(true)}
                            >
                              Change Image
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isProfile && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What kind of person am I?"
                            {...field}
                            maxLength={60}
                            className="text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            className="bg-input resize-none no-scrollbar"
                            placeholder="Take this Qwirl to see how well you know me..."
                            {...field}
                            rows={4}
                            maxLength={100}
                            onChange={(e) => {
                              if (e.target.value.length <= 100) {
                                field.onChange(e);
                              }
                            }}
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value?.length || 0}/100
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end items-center gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={qwirlCoverMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={qwirlCoverMutation.isPending}>
                    {qwirlCoverMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>

            <ImageUploadDialog
              open={isImageDialogOpen}
              onOpenChange={setIsImageDialogOpen}
              title="Upload Background Image"
              aspect={16 / 9}
              onSave={handleImageSave}
            />
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <QwirlCover
      qwirlCoverData={{
        background_image: qwirlCoverData?.background_image,
        title: qwirlCoverData?.title,
        description: qwirlCoverData?.description,
        name: qwirlCoverData?.name,
      }}
      user={{
        name: user?.name,
        username: user?.username || "",
        avatar: user?.avatar,
        categories: user?.categories,
      }}
      variant="owner"
      className={className}
      actions={
        <div className="flex items-center gap-3">
          <Button
            onClick={handleEdit}
            icon={Edit3}
            iconPlacement="left"
            className="rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Customize Cover
          </Button>
        </div>
      }
      isProfile={isProfile}
    />
  );
};

export default EditableQwirlCover;
