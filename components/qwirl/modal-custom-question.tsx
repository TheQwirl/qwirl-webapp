import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import { FormImageUploader } from "../forms/form-image-uploader";

export interface QuestionForm {
  text: string;
  options: string[];
  userAnswer: number;
  imageUrl?: string;
}

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleAddQuestion: (question: QuestionForm) => void;
}

const ModalCustomQuestion: React.FC<Props> = ({
  isModalOpen,
  setIsModalOpen,
  handleAddQuestion,
}) => {
  const { control, watch, setValue, handleSubmit } = useForm<QuestionForm>({
    defaultValues: {
      text: "",
      options: ["", ""],
      userAnswer: 0,
    },
  });

  const handleAddOption = () => {
    if (options.length < 4) {
      setValue("options", [...options, ""]);
    }
  };

  const options = watch("options");
  const userAnswer = watch("userAnswer");
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="overflow-y-auto sm:max-h-[70vh] max-h-screen sm:max-w-2xl">
        <DialogHeader className="">
          <DialogTitle>{"Create Question"}</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <form className="space-y-6">
              <Controller
                control={control}
                name="imageUrl"
                render={({ field }) => (
                  <FormImageUploader
                    onChange={field.onChange}
                    value={field.value}
                    storeAsFile
                    className="md:h-[300px] w-full aspect-square"
                    title="(Optional) Add an image"
                  />
                )}
              />
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
                          <Input {...field} placeholder={`Option ${idx + 1}`} />
                          <Button
                            type="button"
                            variant={userAnswer === idx ? "default" : "outline"}
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
                <Button type="button" variant="outline">
                  Close
                </Button>
                <Button onClick={handleSubmit(handleAddQuestion)} type="submit">
                  Create Question
                </Button>
              </div>
            </form>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCustomQuestion;
