"use client";

import type React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useForm,
  Controller,
  FormProvider,
  useFieldArray,
} from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BarChart3, X, BookOpen, RotateCcw } from "lucide-react";
import { QuestionBankDialog } from "./question-bank-dialog";
import { PostPreview } from "./post-preview";
import PostInitiator from "./post-initiator";
import { PollTemplates } from "./post-templates";
import { PollOptions } from "./poll-options";
import { PostCreatorHeader } from "./post-creator-header";
import { PollSettings } from "./poll-setitngs";
import { PostCreatorData, PostCreatorSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuestionInput } from "./question-input";
import { PostActions } from "./post-actions";
import { PollTemplate } from "./types";

interface Question {
  id: string;
  text: string;
  options: string[];
  tags: string[];
  category: string;
}

const generateInitialPollOptionId = () =>
  Date.now().toString() + Math.random().toString(36).substring(2, 7);

const PostCreator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [importedFromBank, setImportedFromBank] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<PostCreatorData>({
    resolver: zodResolver(PostCreatorSchema),
    defaultValues: {
      content: "",
      question: "",
      duration: "24h",
      pollOptions: [],
    },
  });
  const { control, handleSubmit, watch, setValue, reset } = methods;
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "pollOptions",
    keyName: "keyId",
  });

  const content = watch("content");
  const question = watch("question");
  const pollOptions = watch("pollOptions");
  console.log(selectedTemplate);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowPreview(false);
    setShowQuestionBank(false);
    setValue("pollOptions", []);
    setSelectedTemplate(null);
    setPostImage(null);
    setImportedFromBank(false);
    reset();
  };

  const handleBackToTemplates = () => {
    setValue("pollOptions", []);
    setSelectedTemplate(null);
    setImportedFromBank(false);
    setValue("question", "");
    setShowPreview(false);
  };

  const selectTemplate = (template: PollTemplate) => {
    if (template.id === "questionbank") {
      setShowQuestionBank(true);
      return;
    }

    setSelectedTemplate(template.id);
    setValue("pollOptions", template.options);
    setValue("question", `What's your choice?`);
  };

  const selectQuestionFromBank = (question: Question) => {
    const options = question.options.map((opt, index) => ({
      id: (index + 1).toString(),
      text: opt,
    }));

    setValue("pollOptions", options);
    setValue("question", question.text);
    setSelectedTemplate("questionbank");
    setImportedFromBank(true);
    setShowQuestionBank(false);
  };

  const addOption = () => {
    const newOptionData = {
      id: generateInitialPollOptionId(),
      text: `Option ${fields.length + 1}`,
    };
    append(newOptionData);
  };
  const updateOptionText = (optionId: string, newText: string) => {
    const optionIndex = fields.findIndex((field) => field.id === optionId);
    if (optionIndex !== -1) {
      const currentOptionData = fields[optionIndex];
      update(optionIndex, {
        ...currentOptionData,
        id: optionId,
        text: newText,
      });
    } else {
      console.warn(`Option with id "${optionId}" not found for updating.`);
    }
  };

  const removeOptionByIndex = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    } else {
      console.warn(
        "Cannot remove option. A poll requires at least two options."
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPostImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: PostCreatorData) => {
    const post = {
      id: Date.now().toString(),
      content: data.content,
      question: data.question,
      options: pollOptions,
      duration: data.duration,
      image: postImage,
      timestamp: new Date().toISOString(),
      votes: {},
      totalVotes: 0,
      importedFromBank,
    };
    console.log("Post created:", post);
    handleCollapse();
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto  overflow-hidden">
        <CardContent className="p-0">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <PostInitiator handleExpand={handleExpand} />
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                  <PostCreatorHeader
                    hasPollOptions={pollOptions.length > 0}
                    onCollapse={handleCollapse}
                    onTogglePreview={() => setShowPreview(!showPreview)}
                    showPreview={showPreview}
                  />
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-3 sm:space-y-4"
                    >
                      {/* Content Input */}
                      <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                          <Textarea
                            {...field}
                            placeholder="Share your thoughts... (optional)"
                            className="border-0 resize-none text-base sm:text-lg shadow-none focus-visible:ring-0 min-h-[60px] sm:min-h-[80px]"
                            rows={2}
                          />
                        )}
                      />

                      {postImage && (
                        <div className="relative">
                          <img
                            src={postImage}
                            alt="Post"
                            className="w-full h-32 sm:h-48 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 sm:h-8 sm:w-8"
                            onClick={() => setPostImage(null)}
                          >
                            <X className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      )}

                      <Separator />

                      {/* Poll Section */}
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            <h3 className="font-medium text-sm sm:text-base">
                              Create Your Poll
                            </h3>
                            {importedFromBank && (
                              <Badge variant="secondary" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                From Bank
                              </Badge>
                            )}
                          </div>

                          {/* Back to Templates Button */}
                          {pollOptions.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              icon={RotateCcw}
                              iconPlacement="left"
                              size="sm"
                              onClick={handleBackToTemplates}
                              className="text-xs sm:text-sm h-6 sm:h-8 px-2 sm:px-3"
                            >
                              <span className="hidden sm:inline">
                                Change Template
                              </span>
                              <span className="sm:hidden">Change</span>
                            </Button>
                          )}
                        </div>

                        {/* Poll Templates */}
                        {pollOptions.length === 0 && (
                          <PollTemplates
                            onSelectTemplate={selectTemplate}
                            onStartFromScratch={addOption}
                          />
                        )}

                        {/* Question Input */}
                        {pollOptions.length > 0 && <QuestionInput />}

                        {/* Poll Options */}
                        {pollOptions.length > 0 && (
                          <PollOptions
                            onAddOption={addOption}
                            options={pollOptions}
                            onUpdateOption={updateOptionText}
                            onRemoveOption={removeOptionByIndex}
                          />
                        )}
                      </div>

                      {/* Poll Settings */}
                      {pollOptions.length > 0 && <PollSettings />}

                      {/* Actions */}
                      <PostActions
                        fileInputRef={fileInputRef}
                        onCancel={handleCollapse}
                        onImageUploadClick={() => fileInputRef.current?.click()}
                        onSubmit={handleSubmit(onSubmit)}
                        isSubmitDisabled={!question || pollOptions.length < 2}
                      />
                    </form>
                  </FormProvider>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Preview */}
                {showPreview && pollOptions.length > 0 && (
                  <PostPreview
                    content={content ?? ""}
                    question={question}
                    pollOptions={pollOptions}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      <QuestionBankDialog
        selectQuestionFromBank={selectQuestionFromBank}
        setShowQuestionBank={setShowQuestionBank}
        showQuestionBank={showQuestionBank}
      />
    </>
  );
};

export default PostCreator;
