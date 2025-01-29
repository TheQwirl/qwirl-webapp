import React from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormImageUploader } from "../forms/form-image-uploader";
import { IoMdClose } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { PlusIcon } from "lucide-react";
import clsx from "clsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Zod schema for validation
const questionSchema = z.object({
  text: z
    .string()
    .min(2, "Question must be at least 2 characters")
    .max(1000, "Question cannot exceed 1000 characters"),
  options: z
    .array(
      z
        .string()
        .min(2, "Option must be at least 2 characters")
        .max(100, "Option cannot exceed 100 characters")
    )
    .min(2, "At least 2 options are required")
    .max(4, "Maximum 4 options allowed"),
  userAnswer: z.number({
    required_error: "Please select an answer",
    invalid_type_error: "Please select an answer",
  }),
  imageUrl: z.string().optional(),
});

export type QuestionForm = z.infer<typeof questionSchema>;

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
  const form = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: "",
      options: ["", ""],
      userAnswer: 0,
      imageUrl: "",
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleAddOption = () => {
    const currentOptions = watch("options");
    if (currentOptions.length < 4) {
      setValue("options", [...currentOptions, ""]);
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setValue("options", newOptions);
  };

  const handleSelectAnswer = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    setValue("userAnswer", index);
  };

  const options = watch("options");
  const userAnswer = watch("userAnswer");

  const onSubmit = (data: QuestionForm) => {
    handleAddQuestion(data);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="overflow-y-auto sm:max-h-[80vh] max-h-screen sm:max-w-lg no-scrollbar">
        <DialogHeader>
          <DialogTitle>Create Question</DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="rounded-3xl border bg-card text-card-foreground p-4">
                  <FormField
                    control={control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormImageUploader
                            onChange={field.onChange}
                            value={field.value}
                            storeAsFile
                            className="md:h-[200px] w-full aspect-square"
                            title="(Optional) Add an image"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="text"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your question"
                            className="bg-transparent placeholder:text-gray-400 text-lg font-semibold mt-4 border-none focus-visible:ring-0 shadow-none"
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-destructive mt-1" />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 mt-2">
                    {errors.options?.message && (
                      <p className="text-xs text-destructive">
                        {errors.options.message}
                      </p>
                    )}

                    {options.map((_, idx) => (
                      <div key={idx} className="relative">
                        <FormField
                          control={control}
                          name={`options.${idx}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="flex gap-2 items-center">
                                  <button
                                    type="button"
                                    onClick={(e) => handleSelectAnswer(e, idx)}
                                    className={clsx(
                                      "flex items-center justify-center p-1 rounded-full",
                                      userAnswer === idx
                                        ? "bg-primary text-primary-foreground border border-muted-foreground"
                                        : "bg-transparent text-muted-foreground border-dashed border border-muted-foreground"
                                    )}
                                  >
                                    <IoCheckmark
                                      className={clsx(
                                        "h-4 w-4",
                                        userAnswer === idx && ""
                                      )}
                                    />
                                  </button>
                                  <Input
                                    {...field}
                                    className="bg-secondary/60 placeholder:text-gray-400 rounded-[14px] font-medium text-lg text-card-foreground border-none focus-visible:ring-0 shadow-none"
                                    placeholder={`Option ${idx + 1}`}
                                  />
                                  {options.length > 2 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveOption(idx)}
                                      className="group hover:bg-destructive p-1 rounded-lg hover:text-destructive-foreground transition-all duration-300"
                                    >
                                      <IoMdClose className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs text-destructive mt-1" />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>

                  {options.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="flex items-center gap-2 mt-4 text-sm group"
                    >
                      <PlusIcon className="md:h-4 md:w-4 group-hover:rotate-90 transition-transform duration-300" />
                      <span>Add option</span>
                    </button>
                  )}

                  {errors.userAnswer && (
                    <p className="text-xs text-destructive mt-2">
                      {errors.userAnswer.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button type="submit">Create Question</Button>
                </div>
              </form>
            </Form>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCustomQuestion;
