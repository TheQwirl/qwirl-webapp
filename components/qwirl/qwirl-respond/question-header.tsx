interface QuestionHeaderProps {
  questionText: string;
  isReviewMode: boolean;
}

const QuestionHeader = ({
  questionText,
  isReviewMode,
}: QuestionHeaderProps) => (
  <div>
    <h3 className="text-2xl font-bold leading-tight">{questionText}</h3>
    {!isReviewMode ? (
      <p className="text-xs text-muted-foreground mt-1">
        Tip: Skipping locks the question — you won&apos;t be able to come back.
      </p>
    ) : (
      <p className="text-xs text-muted-foreground mt-1">
        Review mode — read-only.
      </p>
    )}
  </div>
);

export default QuestionHeader;
