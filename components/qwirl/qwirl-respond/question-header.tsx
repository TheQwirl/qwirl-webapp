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
        Pick what resonates with you. You can skip, but you won&apos;t be able
        to come back to it.
      </p>
    ) : (
      <p className="text-xs text-muted-foreground mt-1">
        Reviewing your responses
      </p>
    )}
  </div>
);

export default QuestionHeader;
