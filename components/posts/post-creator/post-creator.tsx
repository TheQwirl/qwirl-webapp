"use client";

import type React from "react";
import { useState, useRef, useMemo } from "react";
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
import Image from "next/image";
import { components } from "@/lib/api/v1-client-side";
import $api from "@/lib/api/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { authStore } from "@/stores/useAuthStore";

type Question = components["schemas"]["QuestionSearchResponse"];

const PostCreator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [postImage, setPostImage] = useState<string | null>(null);
  const [importedFromBank, setImportedFromBank] = useState<null | number>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = authStore();

  const queryClient = useQueryClient();

  const methods = useForm<PostCreatorData>({
    resolver: zodResolver(PostCreatorSchema),
    defaultValues: {
      text_content: "",
      question_text: "",
      duration: null,
      pollOptions: [],
    },
  });

  const { control, handleSubmit, setValue, reset } = methods;

  const {
    fields: pollOptions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "pollOptions",
    keyName: "keyId",
  });

  const handleExpand = () => {
    setIsExpanded(true);
  };

  if (selectedTemplate) console.log(selectedTemplate);

  const handleCollapse = () => {
    setIsExpanded(false);
    setShowPreview(false);
    setShowQuestionBank(false);
    setValue("pollOptions", []);
    setSelectedTemplate(null);
    setPostImage(null);
    setImportedFromBank(null);
    reset();
  };

  const handleBackToTemplates = () => {
    setValue("pollOptions", []);
    setSelectedTemplate(null);
    setImportedFromBank(null);
    setValue("question_text", "");
    setShowPreview(false);
  };

  const createPostMutation = $api.useMutation("post", "/post");
  const queryKey = useMemo(() => ["feed"], []);

  const selectQuestionFromBank = (question: Question) => {
    const options = question.options.map((opt, index) => ({
      id: index + 1,
      text: opt,
    }));
    setValue("selected_option_index", 0);
    setValue("pollOptions", options);
    setValue("question_text", question.question_text);
    setSelectedTemplate("questionbank");
    setImportedFromBank(question.id);
    setShowQuestionBank(false);
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

  const parseDuration = (duration: "1h" | "6h" | "24h" | "7d"): number => {
    const value = parseInt(duration);
    const unit = duration.slice(-1);

    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;

    switch (unit) {
      case "h":
        return value * SECONDS_PER_HOUR;
      case "d":
        return value * SECONDS_PER_DAY;
      default:
        return SECONDS_PER_DAY;
    }
  };

  const onSubmit = async (data: PostCreatorData) => {
    toast.loading("Creating post...", {
      id: "create-post",
    });
    await createPostMutation.mutateAsync(
      {
        body: {
          post_attachment: {
            text_content: data.text_content,
            image_url: postImage,
            question_text: data.question_text,
            duration: data.duration ? parseDuration(data.duration) : null,
            question_bank_id: importedFromBank,
          },
          selected_option_index: data.selected_option_index,
          options: data.pollOptions?.map((opt) => opt.text),
        },
      },
      {
        onSuccess: async () => {
          toast.success("Post created successfully!", {
            id: "create-post",
          });
          handleCollapse();
          await queryClient.invalidateQueries({
            queryKey: ["posts", user?.id],
          });
          await queryClient.invalidateQueries({
            queryKey,
          });
        },
        onError: () => {
          toast.error("An error occurred while creating the post", {
            id: "create-post",
          });
          console.error("Error creating post:", createPostMutation.error);
        },
      }
    );
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
                <FormProvider {...methods}>
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <PostCreatorHeader
                      hasPollOptions={pollOptions.length > 0}
                      onCollapse={handleCollapse}
                      onTogglePreview={() => setShowPreview(!showPreview)}
                      showPreview={showPreview}
                    />
                    <form className="space-y-3 sm:space-y-4">
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Controller
                          name="text_content"
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
                      </motion.div>

                      {postImage && (
                        <div className="relative">
                          <Image
                            width={500}
                            height={200}
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
                              <Badge
                                variant="secondary"
                                className="text-xs whitespace-nowrap"
                              >
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
                            append={append}
                            onShowQuestionBank={() => setShowQuestionBank(true)}
                          />
                        )}

                        {/* Question Input */}
                        {pollOptions.length > 0 && <QuestionInput />}

                        {/* Poll Options */}
                        {pollOptions.length > 0 && (
                          <PollOptions
                            options={pollOptions}
                            append={append}
                            remove={remove}
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
                        isSubmitLoading={createPostMutation.isPending}
                        isSubmitDisabled={pollOptions.length < 2}
                      />
                    </form>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>

                  {/* Preview */}
                  {showPreview && pollOptions.length > 0 && <PostPreview />}
                </FormProvider>
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
