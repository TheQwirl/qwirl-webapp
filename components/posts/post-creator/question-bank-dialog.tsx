import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { components } from "@/lib/api/v1-client-side";
import { QuestionBank } from "@/components/question-bank/question-bank";

type Question = components["schemas"]["QuestionSearchResponse"];

interface QuestionBankDialogProps {
  showQuestionBank: boolean;
  setShowQuestionBank: (show: boolean) => void;
  selectQuestionFromBank: (question: Question) => void;
}

export function QuestionBankDialog({
  showQuestionBank,
  setShowQuestionBank,
  selectQuestionFromBank,
}: QuestionBankDialogProps) {
  return (
    <Dialog open={showQuestionBank} onOpenChange={setShowQuestionBank}>
      <DialogContent className="sm:max-w-4xl max-w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestionBank(false)}
              className="p-1 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Browse Question Bank
          </DialogTitle>
        </DialogHeader>

        <div className="h-[60vh] sm:h-[600px]">
          <QuestionBank onQuestionSelect={selectQuestionFromBank} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
