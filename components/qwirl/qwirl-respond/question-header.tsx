interface QuestionHeaderProps {
  questionText: string;
  isReviewMode: boolean;
}

const QuestionHeader = ({
  questionText,
}: // isReviewMode,
QuestionHeaderProps) => (
  <div>
    <h3 className="text-2xl font-bold leading-tight">{questionText}</h3>
    {/* {!isReviewMode ? (
      <p className="text-xs text-muted-foreground/50 mt-1">
        Skipping is final.
      </p>
    ) : (
      <p className="text-xs text-muted-foreground mt-1">
        Reviewing your responses
      </p>
    )} */}
  </div>
);

export default QuestionHeader;
