import React, { useState } from "react";
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
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Edit3,
  PlusIcon,
  Search,
} from "lucide-react";
import clsx from "clsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";

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
  const [step, setStep] = useState(1);
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
                  onClick={() => setStep(1)}
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
                  onClick={() => setStep(1)}
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
                  onClick={() => setStep(3)}
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
              className="space-y-4 h-[600px] flex flex-col"
            >
              <div className="space-y-4 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    className="pl-10"
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <Select
                  // value={selectedCategory}
                  // onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {[].map((category) => (
                        <SelectItem
                          key={category}
                          value={""}
                          // value={category.toLowerCase()}
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1 flex-wrap">
                    {[].map((tag) => (
                      <Badge
                        key={tag}
                        // variant={
                        //   selectedTags.includes(tag) ? "default" : "outline"
                        // }
                        className="cursor-pointer"
                        // onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results */}
              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {/* {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Searching...
                      </p>
                    </div>
                  ) : questionBankResults.length > 0 ? (
                    questionBankResults.map((question) => (
                      <Card
                        key={question.id}
                        className="cursor-pointer hover:shadow-md transition-all border hover:border-primary/50"
                        onClick={() => handleSelectFromBank(question)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <p className="font-medium text-sm leading-relaxed flex-1">
                                {question.text}
                              </p>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {question.difficulty}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {question.options.map((option, idx) => (
                                <div
                                  key={idx}
                                  className={`text-xs p-2 rounded border ${
                                    idx === question.correctAnswer
                                      ? "bg-green-50 border-green-200 text-green-700"
                                      : "bg-gray-50 border-gray-200"
                                  }`}
                                >
                                  {idx === question.correctAnswer && (
                                    <Check className="h-3 w-3 inline mr-1" />
                                  )}
                                  {option}
                                </div>
                              ))}
                            </div>

                            <div className="flex justify-between items-center">
                              <div className="flex gap-1">
                                {question.tags.slice(0, 3).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <Button size="sm" variant="outline">
                                Add Question
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No questions found. Try adjusting your search.
                      </p>
                    </div>
                  )} */}
                </div>
              </ScrollArea>
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
                                      onClick={(e) =>
                                        handleSelectAnswer(e, idx)
                                      }
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
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ModalCustomQuestion;
