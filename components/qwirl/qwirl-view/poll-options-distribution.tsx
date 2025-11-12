import React from "react";
import PollOption from "../poll-option";

interface Responder {
  user: {
    id: string;
    name: string | null;
    username: string;
    avatar: string | null;
  } | null;
}

interface OptionWithResponders {
  option: string;
  responders: Responder[];
  percentage: number;
  totalResponses: number;
}

interface PollOptionsDistributionProps {
  options: OptionWithResponders[];
  ownerAnswer: string | null;
}

/**
 * PollOptionsDistribution displays all poll options with their response distribution
 */
const PollOptionsDistribution: React.FC<PollOptionsDistributionProps> = ({
  options,
  ownerAnswer,
}) => {
  return (
    <div className="space-y-3">
      {options.map(({ option, responders, percentage }, optionIndex) => {
        const isMyChoice = ownerAnswer === option;
        return (
          <PollOption
            key={optionIndex}
            option={option}
            optionNumber={optionIndex + 1}
            variant="results"
            isMyChoice={isMyChoice}
            responders={responders}
            percentage={percentage}
          />
        );
      })}
    </div>
  );
};

export default PollOptionsDistribution;
