"use client";
import { Wand2, Share2, Gauge, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Wrapper from "./wrapper";
import React, { useState } from "react";
import { Card } from "../ui/card"; // Using Card for the sticky visual

type StepVisualProps = { stepIndex: number };
const StepVisual: React.FC<StepVisualProps> = ({ stepIndex }) => {
  const visuals: React.ReactNode[] = [
    <div
      key="step-1"
      className="flex flex-col items-center justify-center text-center p-8 h-full"
      aria-label="Create Qwirl"
    >
      <Wand2
        className="w-16 h-16 text-primary mb-4"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="text-xl font-bold">Craft Your Questions</h3>
      <p className="text-muted-foreground mt-2">
        Choose from our bank or write your own.
      </p>
      <div className="w-4/5 h-2 bg-muted rounded-full mt-6" />
      <div className="w-full h-2 bg-muted rounded-full mt-3" />
      <div className="w-3/5 h-2 bg-muted rounded-full mt-3" />
    </div>,
    <div
      key="step-2"
      className="flex flex-col items-center justify-center text-center p-8 h-full"
      aria-label="Share Qwirl"
    >
      <Share2
        className="w-16 h-16 text-primary mb-4"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="text-xl font-bold">Send Your Link</h3>
      <p className="text-muted-foreground mt-2">
        Share with friends via any platform.
      </p>
      <div className="mt-6 text-sm font-mono p-3 bg-muted rounded-lg select-all">
        qwirl.io/u/your-name
      </div>
    </div>,
    <div
      key="step-3"
      className="flex flex-col items-center justify-center text-center p-8 h-full"
      aria-label="Discover Wavelength"
    >
      <Gauge
        className="w-16 h-16 text-primary mb-4"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="text-xl font-bold">See Your Score</h3>
      <p className="text-muted-foreground mt-2">
        Discover your compatibility in real-time.
      </p>
      <div
        className="text-6xl font-bold text-primary mt-4"
        aria-label="Wavelength Score"
      >
        87%
      </div>
    </div>,
  ];

  const variants = {
    enter: { opacity: 0, scale: 0.96, y: 20 },
    center: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.96, y: -20 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full h-full"
        aria-live="polite"
      >
        {visuals[stepIndex]}
      </motion.div>
    </AnimatePresence>
  );
};

type TextStepProps = {
  index: number;
  title: string;
  description: string;
  setActiveStep: (step: number) => void;
};
const TextStep: React.FC<TextStepProps> = ({
  index,
  title,
  description,
  setActiveStep,
}) => (
  <motion.div
    className=""
    onViewportEnter={() => setActiveStep(index)}
    tabIndex={0}
    aria-label={`Step ${index + 1}: ${title}`}
  >
    <div className="">
      <span className="text-primary font-bold">Step {index + 1}</span>
    </div>
    <h3 className="text-3xl font-bold text-foreground mb-4">{title}</h3>
    <p className="text-lg text-muted-foreground leading-relaxed">
      {description}
    </p>
  </motion.div>
);

type Step = {
  title: string;
  description: string;
};
const steps: Step[] = [
  {
    title: "Create your Qwirl",
    description:
      "Pick 15 defining polls from our question bank or craft your own unique questions with up to 6 response options each.",
  },
  {
    title: "Share with friends",
    description:
      "Send your Qwirl link to friends. They'll answer each poll and instantly see your choices and how others voted.",
  },
  {
    title: "Discover your wavelength",
    description:
      "Get your compatibility score that reveals how aligned you and your friends really are across all your beliefs and preferences.",
  },
];

export function HowItWorks(): React.ReactElement {
  const [activeStep, setActiveStep] = useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Wrapper className="bg-muted py-24 w-full !min-h-0 !relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-4 bg-card">
            How it works
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Three simple steps to
            <span className="text-primary"> decode personalities</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop scrolling through feeds to understand people. Get to the core
            of who they are in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-center">
          {/* Left Column: Sticky Visual */}
          <div className="sticky top-32 h-[300px] lg:h-[500px] w-full col-span-full lg:col-span-1">
            <Card
              className="w-full h-full overflow-hidden"
              aria-label="Step Visual"
            >
              <StepVisual stepIndex={activeStep} />
            </Card>
          </div>

          {/* Right Column: Scrolling Text */}
          <div className="flex flex-col gap-4 col-span-full lg:col-span-2">
            {steps.map((step, index) => (
              <TextStep
                key={index}
                index={index}
                title={step.title}
                description={step.description}
                setActiveStep={setActiveStep}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            aria-label="Get started now"
            icon={ArrowRight}
            iconPlacement="right"
          >
            Get started now
          </Button>
        </motion.div>
      </div>
    </Wrapper>
  );
}
