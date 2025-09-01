import { useEffect, useState } from "react";

export const useCommentState = (existingComment: string | null) => {
  const [commentDraft, setCommentDraft] = useState<string>(
    existingComment ?? ""
  );
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  // Reset comment editor when poll changes
  useEffect(() => {
    setShowCommentBox(false);
    setIsEditingComment(false);
    setCommentDraft(existingComment ?? "");
  }, [existingComment]);

  return {
    commentDraft,
    setCommentDraft,
    isEditingComment,
    setIsEditingComment,
    showCommentBox,
    setShowCommentBox,
  };
};
