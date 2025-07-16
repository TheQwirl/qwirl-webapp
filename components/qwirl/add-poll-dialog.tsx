import React, { useState } from "react";
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
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Edit3,
  Plus,
  X,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { QuestionBank } from "../question-bank/question-bank";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QwirlPollData, QwirlPollSchema } from "./schema";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";

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
  const methods = useForm<QwirlPollData>({
    resolver: zodResolver(QwirlPollSchema),
    defaultValues: {
      question_text: "",
      options: [],
    },
  });
  const options = methods.watch("options");
  const ownerAnswerIndex = methods.watch("owner_answer_index");
  console.log(methods.formState.errors);

  const onCustomQuestion = () => {
    const defaultOptions = ["Option 1", "Option 2"];
    methods.reset({
      question_text: "",
      options: defaultOptions,
      owner_answer_index: 0,
    });
  };

  const addOption = () => {
    const newOption = `Option ${options.length + 1}`;
    const newOptions = [...options, newOption];
    methods.setValue("options", newOptions, { shouldValidate: true });

    const current = methods.getValues("owner_answer_index");
    if (current === undefined || current >= newOptions.length) {
      methods.setValue("owner_answer_index", 0, { shouldValidate: true });
    }
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      console.warn(
        "Cannot remove option. A poll requires at least two options."
      );
      return;
    }

    const newOptions = options.filter((_, i) => i !== index);
    const currentIndex = methods.getValues("owner_answer_index");

    methods.setValue("options", newOptions, { shouldValidate: true });

    if (currentIndex === index) {
      const fallback = Math.min(index, newOptions.length - 1);
      methods.setValue("owner_answer_index", fallback, {
        shouldValidate: true,
      });
    } else if (currentIndex > index) {
      methods.setValue("owner_answer_index", currentIndex - 1, {
        shouldValidate: true,
      });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Question</Label>
                </div>
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Controller
                    name="question_text"
                    control={methods.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="What's your question?"
                        className="text-sm sm:text-base font-medium"
                      />
                    )}
                  />
                </motion.div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Options</Label>
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Checkbox
                        checked={index === ownerAnswerIndex}
                        onCheckedChange={() => {
                          if (index !== ownerAnswerIndex) {
                            methods.setValue("owner_answer_index", index, {
                              shouldValidate: true,
                            });
                          }
                        }}
                      />
                    </motion.div>
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-center gap-2 flex-1"
                    >
                      <Controller
                        control={methods.control}
                        name={`options.${index}` as const}
                        defaultValue={option}
                        render={({ field }) => (
                          <Input
                            {...field}
                            maxLength={60}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1 text-sm sm:text-base"
                          />
                        )}
                      />
                    </motion.div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeOption(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
                {options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    icon={Plus}
                    iconPlacement="left"
                    className="w-full border-dashed text-xs sm:text-sm"
                    onClick={addOption}
                  >
                    Add option
                  </Button>
                )}
              </div>
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
                  methods.reset();
                  setStep(1);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!methods.formState.isValid}
              onClick={methods.handleSubmit(handleAddPoll)}
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
