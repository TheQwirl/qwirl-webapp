"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, ChevronRight, Edit3 } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { QuestionBank } from "../question-bank/question-bank";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import {
  CompactQuestionCardEditable,
  CompactQuestionCardEditableRef,
} from "./compact-question-card-editable";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAddPoll: (question: QwirlPollData) => void;
  isSubmitting?: boolean;
}

const AddPollDialog: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  handleAddPoll,
  isSubmitting = false,
}) => {
  const [step, setStep] = useState(1);
  const questionCardRef = useRef<CompactQuestionCardEditableRef>(null);

  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: "",
      options: [],
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      methods.reset({
        question_text: "",
        options: [],
      });
      setStep(1);
    }
  }, [isModalOpen, methods]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      methods.reset({
        question_text: "",
        options: [],
      });
      setStep(1);
    }
    setIsModalOpen(open);
  };

  const onCustomQuestion = () => {
    const defaultOptions = ["Option 1", "Option 2"];
    methods.reset({
      question_text: "",
      options: defaultOptions,
      owner_answer_index: 0,
    });
  };

  const handleQuestionSave = async () => {
    const data = await questionCardRef.current?.submit();
    if (data) {
      handleAddPoll(data);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange} modal>
      <DialogContent className="overflow-y-auto sm:max-h-[80vh] max-h-screen sm:max-w-xl no-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && "Add Question"}
            {step === 2 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowLeft}
                  iconPlacement="left"
                  onClick={() => {
                    methods.reset();
                    setStep(1);
                  }}
                  className="p-1 h-auto"
                ></Button>
                Browse Question Bank
              </>
            )}
            {step === 3 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={ArrowLeft}
                  iconPlacement="left"
                  onClick={() => {
                    methods.reset();
                    setStep(1);
                  }}
                  className="p-1 h-auto"
                ></Button>
                Create Custom Question
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 py-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                  onClick={() => setStep(2)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Question Bank</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose from thousands of pre-made questions
                      </p>
                    </div>
                    <Button
                      icon={ChevronRight}
                      iconPlacement="right"
                      variant="outline"
                      className="w-full"
                    >
                      Browse Questions
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                  onClick={() => {
                    onCustomQuestion();
                    setTimeout(() => setStep(3), 0);
                  }}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Edit3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Custom Question</h3>
                      <p className="text-sm text-muted-foreground">
                        Create your own question from scratch
                      </p>
                    </div>
                    <Button
                      icon={ChevronRight}
                      iconPlacement="right"
                      variant="outline"
                      className="w-full"
                    >
                      Create Question
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <QuestionBank
                onQuestionSelect={(question) => {
                  methods.reset({
                    question_text: question.question_text,
                    options: question.options,
                    owner_answer_index: 0,
                  });
                  setStep(3);
                }}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <CompactQuestionCardEditable
                ref={questionCardRef}
                question={methods.watch("question_text")}
                answers={methods.watch("options")}
                selectedAnswer={
                  methods.watch("options")[
                    methods.watch("owner_answer_index") ?? 0
                  ] || ""
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
        {step === 3 && (
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!questionCardRef.current?.isValid()}
              onClick={handleQuestionSave}
              loading={isSubmitting}
            >
              Add Poll
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddPollDialog;
