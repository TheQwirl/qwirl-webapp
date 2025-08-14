import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FooterProps {
  onPrevious: () => void;
  onPrimaryCta: () => void;
  prevNavigable: number | null;
  currentPosition: number;
  primaryCtaText: string;
  finishLoading: boolean;
  isLastPoll: boolean;
}

const Footer = ({
  onPrevious,
  onPrimaryCta,
  prevNavigable,
  currentPosition,
  primaryCtaText,
  finishLoading,
  isLastPoll,
}: FooterProps) => (
  <div className="flex items-center justify-between mt-4">
    <Button
      icon={ChevronLeft}
      iconPlacement="left"
      onClick={onPrevious}
      disabled={prevNavigable === null || currentPosition <= 1}
      variant="outline"
      size="sm"
    >
      Previous
    </Button>

    <div className="flex items-center gap-2">
      <Button
        icon={ChevronRight}
        loading={finishLoading}
        iconPlacement="right"
        onClick={onPrimaryCta}
        variant="outline"
        disabled={isLastPoll && finishLoading}
        size="sm"
      >
        {primaryCtaText}
      </Button>
    </div>
  </div>
);

export default Footer;
