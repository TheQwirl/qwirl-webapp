import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { motion } from "framer-motion";
import { MessageSquare, Pencil, X } from "lucide-react";

interface CommentsSectionProps {
  existingComment: string | null;
  showCommentBox: boolean;
  isEditingComment: boolean;
  commentDraft: string;
  isReviewMode: boolean;
  saveMutationPending: boolean;
  onOpenCommentBox: () => void;
  onCancelComment: () => void;
  onSaveComment: () => void;
  onCommentDraftChange: (val: string) => void;
}

const CommentsSection = ({
  existingComment,
  showCommentBox,
  isEditingComment,
  commentDraft,
  isReviewMode,
  saveMutationPending,
  onOpenCommentBox,
  onCancelComment,
  onSaveComment,
  onCommentDraftChange,
}: CommentsSectionProps) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    className="space-y-3 pt-4 border-t"
  >
    {/* No comment yet */}
    {!existingComment && !showCommentBox && !isReviewMode && (
      <Button
        variant="outline"
        size="sm"
        icon={MessageSquare}
        iconPlacement="left"
        onClick={onOpenCommentBox}
        className="h-8 text-xs"
      >
        Say Something
      </Button>
    )}

    {/* Existing comment read-only */}
    {existingComment && !isEditingComment && (
      <div className="rounded-xl border p-3">
        <div className="text-xs text-muted-foreground mb-1">Your comment</div>
        <p className="text-sm">{existingComment}</p>
        {!isReviewMode && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              iconPlacement="left"
              icon={Pencil}
              onClick={onOpenCommentBox}
              className="h-7 text-xs"
            >
              Edit Comment
            </Button>
          </div>
        )}
      </div>
    )}

    {/* Editor */}
    {isEditingComment && !isReviewMode && (
      <div className="space-y-3">
        <Label htmlFor="comment" className="text-xs font-medium">
          {existingComment ? "Edit your comment" : "Add a comment (optional)"}
        </Label>
        <Textarea
          id="comment"
          placeholder="Share your thoughts..."
          value={commentDraft}
          onChange={(e) => onCommentDraftChange(e.target.value)}
          className="min-h-[60px] resize-none text-sm"
          maxLength={CONSTANTS.COMMENT_MAX_LENGTH}
          disabled={saveMutationPending}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {commentDraft.length}/{CONSTANTS.COMMENT_MAX_LENGTH}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={X}
              iconPlacement="left"
              onClick={onCancelComment}
              disabled={saveMutationPending}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={onSaveComment}
              loading={saveMutationPending}
              disabled={
                saveMutationPending ||
                commentDraft.trim().length === 0 ||
                commentDraft.trim() === (existingComment ?? "").trim()
              }
              className="h-7 text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    )}
  </motion.div>
);

export default CommentsSection;
