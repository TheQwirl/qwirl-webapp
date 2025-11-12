import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONSTANTS } from "@/constants/qwirl-respond";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

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
    {/* Always visible comment input */}
    {!isReviewMode && (
      <div className="relative">
        <Input
          placeholder="Say something or share why you're skipping..."
          value={commentDraft}
          onChange={(e) => onCommentDraftChange(e.target.value)}
          className="pr-12 bg-muted/40"
          maxLength={CONSTANTS.COMMENT_MAX_LENGTH}
          disabled={saveMutationPending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && commentDraft.trim()) {
              e.preventDefault();
              onSaveComment();
            }
          }}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={onSaveComment}
          disabled={
            saveMutationPending ||
            commentDraft.trim().length === 0 ||
            commentDraft.trim() === (existingComment ?? "").trim()
          }
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
        >
          <Send className="h-4 w-4 text-primary" />
        </Button>
      </div>
    )}

    {/* Show existing comment if in review mode */}
    {isReviewMode && existingComment && (
      <div className="rounded-xl border p-3 bg-muted/20">
        <div className="text-xs text-muted-foreground mb-1">Your comment</div>
        <p className="text-sm">{existingComment}</p>
      </div>
    )}
  </motion.div>
);

export default CommentsSection;
