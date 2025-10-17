"use client";

import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { toast } from "sonner";
import { Edit3, Camera, X, ImageIcon as ImageIconLucide } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserAvatar } from "@/components/user-avatar";
import ImageUploadDialog from "@/components/image-upload-dialog";
import { cn } from "@/lib/utils";
import $api from "@/lib/api/client";
import { authStore } from "@/stores/useAuthStore";

// Zod schema for form validation
const qwirlHeaderSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(60, "Title must be less than 60 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200, "Description must be less than 200 characters"),
  background_image: z.string().nullable().optional(),
});

type QwirlHeaderFormData = z.infer<typeof qwirlHeaderSchema>;

interface EditableQwirlCoverProps {
  className?: string;
}

const EditableQwirlCover: React.FC<EditableQwirlCoverProps> = ({
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { user } = authStore();

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
  const qwirlData = qwirlQuery.data;
  const isLoading = qwirlCoverQuery.isLoading || qwirlQuery.isLoading;

  const getDefaultValues = useCallback(
    (): QwirlHeaderFormData => ({
      title: qwirlCoverData?.title || "What kind of person am I?",
      description:
        qwirlCoverData?.description ||
        "Take this Qwirl to see how well you know me and find out what we have in common. Let's see if we're a match!",
      background_image: qwirlCoverData?.background_image || null,
    }),
    [qwirlCoverData]
  );

  const form = useForm<QwirlHeaderFormData>({
    resolver: zodResolver(qwirlHeaderSchema),
    defaultValues: getDefaultValues(),
  });

  React.useEffect(() => {
    if (qwirlCoverData || user) {
      form.reset(getDefaultValues());
    }
  }, [qwirlCoverData, user, form, getDefaultValues]);

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

  const handleCopyUrl = async () => {
    if (!user?.username) return;
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/qwirl/${user.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  if (isLoading) {
    return (
      <Card className={cn("max-w-2xl mx-auto overflow-hidden", className)}>
        <CardContent className="p-8 flex flex-col items-center text-center">
          <Skeleton className="w-full h-48 rounded-lg mb-6" />
          <Skeleton className="h-24 w-24 rounded-full -mt-16 mb-4" />
          <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-4 w-32 mx-auto mb-4" />
          <Skeleton className="h-16 w-full max-w-md mx-auto mb-6" />
          <Skeleton className="h-12 w-40 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("max-w-2xl mx-auto", className)}
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

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What kind of person am I?"
                          {...field}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-input "
                          placeholder="Take this Qwirl to see how well you know me..."
                          {...field}
                          rows={3}
                        />
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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("max-w-2xl mx-auto", className)}
    >
      <Card className="bg-white shadow-lg rounded-lg text-center p-8 flex flex-col items-center">
        {/* Background Image */}
        <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden">
          {qwirlCoverData?.background_image ? (
            <>
              <Image
                src={qwirlCoverData.background_image}
                alt="Qwirl Cover"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br  from-primary/20 via-primary/20 to-primary/50" />
          )}
        </div>

        {/* Avatar overlapping the background */}
        <div className="-mt-16 mb-4 z-10 relative">
          <UserAvatar
            image={user?.avatar ?? ""}
            size="xl"
            className="w-full h-full"
            ringed
            name={user?.name || user?.username || "User"}
          />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900">
          {qwirlCoverData?.title}
        </h2>

        {/* Username */}
        <p className="text-gray-600 mt-2 text-xs">
          By @{user?.username || "user"}
        </p>

        {/* Description */}
        <p className="text-gray-600 mt-4 max-w-md">
          {qwirlCoverData?.description ||
            "Take this Qwirl to see how well you know me and find out what we have in common. Let's see if we're a match!"}
        </p>

        {/* Categories */}
        {user?.categories && user.categories.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mt-4">
            {user.categories.map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="font-normal text-xs px-3 py-1"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={handleEdit}
            icon={Edit3}
            iconPlacement="left"
            className="rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            Customize Cover
          </Button>
        </div>
      </Card>

      <ImageUploadDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        title="Upload Background Image"
        aspect={16 / 9}
        onSave={handleImageSave}
      />
    </motion.div>
  );
};

export default EditableQwirlCover;
