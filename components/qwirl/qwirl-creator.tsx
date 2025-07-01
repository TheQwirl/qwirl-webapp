"use client";
import React, { useState } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Search, Plus, X, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";

interface Question {
  id: string;
  text: string;
  imageUrl?: string;
  options: string[];
  isHidden: boolean;
  userAnswer: number;
  position: number;
}

interface QuestionForm {
  text: string;
  options: string[];
  userAnswer: number;
}

const QwirlCreator = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { control, handleSubmit, watch, setValue } = useForm<QuestionForm>({
    defaultValues: {
      text: "",
      options: ["", ""],
      userAnswer: 0,
    },
  });

  const options = watch("options");
  const userAnswer = watch("userAnswer");

  const handleAddOption = () => {
    if (options.length < 4) {
      setValue("options", [...options, ""]);
    }
  };

  const onSubmit = async (data: QuestionForm) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: data.text,
      options: data.options,
      userAnswer: data.userAnswer,
      isHidden: questions.length >= 25,
      position: questions.length,
    };

    await fetch("/api/questions", {
      method: "POST",
      body: JSON.stringify(newQuestion),
    });

    setQuestions([...questions, newQuestion]);
    setIsModalOpen(false);
  };

  const handleReorder = async (reorderedQuestions: Question[]) => {
    const updatedQuestions = reorderedQuestions.map((q, idx) => ({
      ...q,
      isHidden: idx >= 25,
      position: idx,
    }));

    await fetch("/api/questions/reorder", {
      method: "PATCH",
      body: JSON.stringify({ questions: updatedQuestions }),
    });

    setQuestions(updatedQuestions);
  };

  return (
    <div className="p-6 max-w-4xl overl mx-auto">
      <div className="mb-6">
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={questions.length >= 35}
          className="group"
        >
          <Plus className="mr-2 group-hover:rotate-90 transition-transform" />
          Add Question
        </Button>
      </div>

      <Reorder.Group
        axis="y"
        values={questions}
        onReorder={handleReorder}
        className="space-y-4"
      >
        {questions.map((question) => (
          <Reorder.Item
            key={question.id}
            value={question}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`p-4 rounded-lg border ${
              question.isHidden ? "bg-gray-50" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{question.text}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  /* Handle delete */
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Choose Question Type" : "Create Question"}
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search question bank..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full justify-between"
                >
                  Create Custom Question
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <Controller
                      name="text"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input {...field} placeholder="Enter your question" />
                      )}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Options</Label>
                    {options.map((_, idx) => (
                      <div key={idx} className="relative">
                        <Controller
                          name={`options.${idx}`}
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                placeholder={`Option ${idx + 1}`}
                              />
                              <Button
                                type="button"
                                variant={
                                  userAnswer === idx ? "default" : "outline"
                                }
                                className="w-24"
                                onClick={() => setValue("userAnswer", idx)}
                              >
                                {userAnswer === idx ? "Correct ✓" : "Select"}
                              </Button>
                            </div>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {options.length < 4 && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleAddOption}
                      className="w-full"
                    >
                      Add Option
                    </Button>
                  )}

                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit">Create Question</Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QwirlCreator;
