import { Button } from "@/components/ui/button";
import { HelpCircle, Lightbulb } from "lucide-react";
import CollapsibleCard from "@/components/collapsible-card";
import React from "react";

const TipsGuideCard: React.FC = () => {
  return (
    <CollapsibleCard
      title="Tips & Guide"
      defaultOpen={false}
      icon={<Lightbulb className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Create engaging polls</p>
              <p className="text-muted-foreground text-xs">
                Ask questions that reveal your personality and beliefs
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Add variety</p>
              <p className="text-muted-foreground text-xs">
                Mix serious, fun, and quirky questions for best results
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
            <div>
              <p className="font-medium">Customize your header</p>
              <p className="text-muted-foreground text-xs">
                Add a background image and personal description
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 border-t">
          <Button
            variant="ghost"
            size="xs"
            icon={HelpCircle}
            iconPlacement="left"
            className="w-full justify-start "
          >
            Need help? View full guide
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default TipsGuideCard;
