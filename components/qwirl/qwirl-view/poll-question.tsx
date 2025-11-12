import React from "react";

interface PollQuestionProps {
  questionText: string;
}

/**
 * PollQuestion component displays the poll question text
 */
const PollQuestion: React.FC<PollQuestionProps> = ({ questionText }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 leading-tight">
        {questionText}
      </h2>
    </div>
  );
};

export default PollQuestion;
