"use client";

import * as React from "react";
import { MoreVertical, Trash2, Share, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirmationModal } from "@/stores/useConfirmationModal";
import { Post } from "@/types/posts";
import clsx from "clsx";
import $api from "@/lib/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { authStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

type PostOptionsDropdownProps = {
  post: Post;
  className?: string;
};

export const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({
  post,
  className,
}) => {
  const { show } = useConfirmationModal();
  const queryClient = useQueryClient();
  const { user } = authStore();

  const deleteMutation = $api.useMutation("delete", "/post/{post_id}");
  const queryKey = React.useMemo(() => ["feed"], []);

  const handleShare = () => {
    console.log("Share post", post);
  };

  const handleDelete = () => {
    show({
      title: "Are you sure you want to delete this post?",
      description: "This action is irreversible.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => {
        toast.loading("Deleting Post...", {
          id: "delete-post",
        });
        return deleteMutation.mutateAsync(
          { params: { path: { post_id: post.id } } },
          {
            onSuccess: async () => {
              toast.success("Post deleted successfully!", {
                id: "delete-post",
              });
              await queryClient.invalidateQueries({
                queryKey,
              });
              await queryClient.invalidateQueries({
                queryKey: ["posts", user?.id],
              });
            },
            onError: () => {
              toast.error("Failed to delete post. Please try again.", {
                id: "delete-post",
              });
            },
          }
        );
      },
    });
  };

  const handleReport = () => {
    show({
      title: "Report Post",
      description: "Please provide a reason for reporting this post.",
      confirmLabel: "Report",
      cancelLabel: "Cancel",
      onConfirm: () => {
        return new Promise((resolve) =>
          setTimeout(() => {
            toast.success("Post reported successfully!", {
              id: "report-post",
            });
            resolve();
          }, 1000)
        );
        // Implement report logic here
      },
    });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
            className
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleReport}>
          <Flag className="mr-2 h-4 w-4 text-orange-500" />
          Report
        </DropdownMenuItem>
        {post?.is_mine && (
          <DropdownMenuItem onClick={handleDelete} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
