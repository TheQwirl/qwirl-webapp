"use client";

import type { CardComponentProps } from "onborda";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion } from "framer-motion";

export const OnbordaCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="w-full max-w-md shadow-lg border-2">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {step.icon && (
                <div className="text-3xl flex-shrink-0">{step.icon}</div>
              )}
              <CardTitle className="text-xl font-semibold leading-tight">
                {step.title}
              </CardTitle>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <CardDescription className="text-sm leading-relaxed text-foreground">
            {step.content}
          </CardDescription>
        </CardContent>

        <CardFooter className="flex justify-between gap-2 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={isFirstStep}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <Button size="sm" onClick={nextStep} className="gap-1">
            {isLastStep ? (
              <>
                Finish
                <X className="h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>

        {/* Arrow pointer */}
        <div className="onborda-arrow">{arrow}</div>
      </Card>
    </motion.div>
  );
};
