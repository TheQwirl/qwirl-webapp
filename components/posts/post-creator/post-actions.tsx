import { Button } from "@/components/ui/button";
import { ImageIcon, Smile, Hash, Send } from "lucide-react";
import { RefObject } from "react";

interface PostActionsProps {
  onImageUploadClick: () => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export function PostActions({
  onImageUploadClick,
  onCancel,
  onSubmit,
  isSubmitDisabled,
  fileInputRef,
}: PostActionsProps) {
  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onImageUploadClick}
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Smile className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-10 sm:w-10"
          >
            <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-xs sm:text-sm px-2 sm:px-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            icon={Send}
            iconPlacement="left"
            disabled={isSubmitDisabled}
            onClick={onSubmit}
            className="bg-primary hover:bg-primary/90 text-xs sm:text-sm px-2 sm:px-3"
          >
            Post
          </Button>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              if (ev.target?.result) {
                // Note: Image handling is managed in parent component
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />
    </>
  );
}
