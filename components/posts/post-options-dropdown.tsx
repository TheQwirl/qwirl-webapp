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

type PostOptionsDropdownProps = {
  post: Post;
  className?: string;
};

export const PostOptionsDropdown: React.FC<PostOptionsDropdownProps> = ({
  post,
  className,
}) => {
  const { show } = useConfirmationModal();

  const deleteMutation = $api.useMutation("delete", "/post/{post_id}");

  const handleShare = () => {
    // Placeholder: open share modal or copy link
    console.log("Share post", post);
  };

  const handleDelete = () => {
    show({
      title: "Are you sure you want to delete this post?",
      description: "This action is irreversible.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      onConfirm: () => {
        deleteMutation.mutateAsync({ params: { path: { post_id: post.id } } });
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
        console.log("Report post", post);
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
