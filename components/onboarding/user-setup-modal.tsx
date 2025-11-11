"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Form } from "@/components/ui/form";
import { authStore } from "@/stores/useAuthStore";
import { useUserSync } from "@/hooks/useUserSync";
import { useOnboardingStore } from "@/stores/useOnboardingStore";
import $api from "@/lib/api/client";
import { toast } from "sonner";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { CategorySelectionStep } from "./steps/category-selection-step";
import { ScrollArea } from "../ui/scroll-area";

interface UserSetupModalProps {
  open: boolean;
  onClose: () => void;
}

type OnboardingStep = "personal-details" | "categories";

const personalDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phone: z
    .string()
    .regex(/^\+?[\d\s-]{10,}$/, "Invalid phone number")
    .nullable()
    .optional(),
});

export function UserSetupModal({ open, onClose }: UserSetupModalProps) {
  const { user } = authStore();
  const { syncUser } = useUserSync();
  const router = useRouter();
  const pathname = usePathname();
  const { setShouldStartTour, startTour } = useOnboardingStore();

  const [currentStep, setCurrentStep] =
    useState<OnboardingStep>("personal-details");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const form = useForm<z.infer<typeof personalDetailsSchema>>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      name: user?.name || "",
      username: user?.username || "",
      phone: user?.phone || null,
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user?.name || "",
        username: user?.username || "",
        phone: user?.phone || null,
      });
      setSelectedCategories(user?.categories || []);
    }
  }, [user, form]);

  const updateUserMutation = $api.useMutation("patch", "/users/me", {
    onSuccess: async (response) => {
      if (response) {
        syncUser(response);
      }
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating your profile");
    },
  });

  const completeOnboardingMutation = $api.useMutation("patch", "/users/me", {
    onSuccess: async (response) => {
      if (response) {
        // Sync user data first
        await syncUser(response);
        console.log("User setup complete, user data synced:", response);
      }

      // Set flag to start tour
      setShouldStartTour(true);
      console.log("Set shouldStartTour to true");

      toast.success("Welcome to Qwirl! 🎉");
      onClose();

      // Check if already on edit page
      const isOnEditPage = pathname === "/qwirls/primary/edit";
      console.log("Is already on edit page:", isOnEditPage);

      if (isOnEditPage) {
        // If already on edit page, start tour directly after a small delay
        setTimeout(() => {
          console.log("Already on edit page, starting tour directly...");
          startTour();
        }, 1500);
      } else {
        // Redirect to edit page to start interactive tour
        setTimeout(() => {
          console.log("Redirecting to edit page...");
          router.push("/qwirls/primary/edit");
        }, 800);
      }
    },
    onError: (error) => {
      console.error("Error completing onboarding:", error);
      toast.error("An error occurred while completing onboarding");
    },
  });

  const steps: Array<{
    id: OnboardingStep;
    title: string;
    description: string;
  }> = [
    {
      id: "personal-details",
      title: "Personal Details",
      description: "Tell us about yourself",
    },
    {
      id: "categories",
      title: "Choose Interests",
      description: "Select up to 5 categories you're interested in",
    },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = useCallback(async () => {
    switch (currentStep) {
      case "personal-details":
        // Validate and update personal details
        const isValid = await form.trigger();
        if (!isValid) return;

        const formData = form.getValues();
        try {
          await updateUserMutation.mutateAsync({
            body: {
              name: formData.name,
              username: formData.username,
              phone: formData.phone || null,
            },
          });
          setCurrentStep("categories");
        } catch {
          // Error is handled by the mutation
          return;
        }
        break;

      case "categories":
        await updateUserMutation.mutateAsync({
          body: { categories: selectedCategories },
        });
        await completeOnboardingMutation.mutateAsync(
          {
            body: { has_seen_onboarding: true },
          },
          {
            onSuccess: (data) => {
              syncUser(data);
            },
          }
        );
        break;
    }
  }, [
    currentStep,
    form,
    selectedCategories,
    updateUserMutation,
    completeOnboardingMutation,
    syncUser,
  ]);

  const handlePrevious = () => {
    switch (currentStep) {
      case "categories":
        setCurrentStep("personal-details");
        break;
    }
  };

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "personal-details":
        const formData = form.getValues();
        return formData.name.length >= 2 && formData.username.length >= 3;
      case "categories":
        return selectedCategories.length > 0;
    }
  }, [currentStep, form, selectedCategories]);

  const isLoading =
    updateUserMutation.isPending || completeOnboardingMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={() => {}} defaultOpen>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Welcome to Qwirl!
          </DialogTitle>
          <DialogDescription>
            {steps[currentStepIndex]?.description}
          </DialogDescription>

          {/* Progress */}
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-sm">
              <span>
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            <ScrollArea className="h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6"
                >
                  {currentStep === "personal-details" && (
                    <PersonalDetailsStep form={form} />
                  )}

                  {currentStep === "categories" && (
                    <CategorySelectionStep
                      selectedCategories={selectedCategories}
                      onCategoriesChange={setSelectedCategories}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </Form>
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === "personal-details" || isLoading}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            loading={isLoading}
          >
            {currentStep === "categories" ? "Finish" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
