"use client";

import React, { useState, Children, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./Stepper.css";

// ─── Types ───────────────────────────────────────────────────

interface StepperProps {
  children: React.ReactNode;
  /** Controlled 1-indexed step. Provide this to drive the stepper externally. */
  step?: number;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  stepContainerClassName?: string;
  contentClassName?: string;
  disableStepIndicators?: boolean;
  /** Optional labels rendered below each indicator circle */
  stepLabels?: string[];
  className?: string;
}

// ─── Step Variants ───────────────────────────────────────────

const stepVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? "-50%" : "50%",
    opacity: 0,
  }),
};

// ─── Stepper ─────────────────────────────────────────────────

export default function Stepper({
  children,
  step: controlledStep,
  initialStep = 1,
  onStepChange = () => {},
  stepContainerClassName = "",
  contentClassName = "",
  disableStepIndicators = false,
  stepLabels = [],
  className = "",
}: StepperProps) {
  const isControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(initialStep);
  const currentStep = isControlled ? controlledStep : internalStep;

  const [direction, setDirection] = useState(0);
  const prevStepRef = useRef(currentStep);

  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;

  useEffect(() => {
    if (currentStep !== prevStepRef.current) {
      setDirection(currentStep > prevStepRef.current ? 1 : -1);
      prevStepRef.current = currentStep;
    }
  }, [currentStep]);

  const handleIndicatorClick = (clicked: number) => {
    if (disableStepIndicators || clicked === currentStep) return;
    const newStep = clicked;
    if (!isControlled) setInternalStep(newStep);
    onStepChange(newStep);
  };

  return (
    <div className={`stepper-wrapper ${className}`}>
      {/* Step indicator circles + connectors */}
      <div className={`step-indicator-row ${stepContainerClassName}`}>
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1;
          const isNotLastStep = index < totalSteps - 1;
          const status =
            currentStep === stepNumber
              ? "active"
              : currentStep < stepNumber
                ? "inactive"
                : "complete";
          return (
            <React.Fragment key={stepNumber}>
              <div className="step-indicator-group">
                <StepIndicator
                  step={stepNumber}
                  currentStep={currentStep}
                  disableStepIndicators={disableStepIndicators}
                  onClickStep={handleIndicatorClick}
                />
                {stepLabels[index] && (
                  <span
                    className={`step-label step-label-${status}`}
                  >
                    {stepLabels[index]}
                  </span>
                )}
              </div>
              {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Animated step content */}
      <div className={`step-content-area ${contentClassName}`}>
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          >
            {stepsArray[currentStep - 1]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Step ────────────────────────────────────────────────────

export function Step({ children }: { children: React.ReactNode }) {
  return <div className="step-default">{children}</div>;
}

// ─── StepIndicator ───────────────────────────────────────────

function StepIndicator({
  step,
  currentStep,
  onClickStep,
  disableStepIndicators,
}: {
  step: number;
  currentStep: number;
  onClickStep: (step: number) => void;
  disableStepIndicators: boolean;
}) {
  const status =
    currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";

  return (
    <motion.div
      onClick={() => onClickStep(step)}
      className="step-indicator"
      style={disableStepIndicators ? { pointerEvents: "none" } : {}}
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: {
            scale: 1,
            backgroundColor: "hsl(var(--muted))",
          },
          active: {
            scale: 1.05,
            backgroundColor: "hsl(var(--primary))",
          },
          complete: {
            scale: 1,
            backgroundColor: "hsl(var(--primary))",
          },
        }}
        transition={{ duration: 0.3 }}
        className="step-indicator-inner"
      >
        {status === "complete" ? (
          <CheckIcon className="check-icon" />
        ) : status === "active" ? (
          <div className="active-dot" />
        ) : (
          <span className="step-number">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── StepConnector ───────────────────────────────────────────

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={{
          incomplete: { width: "0%", backgroundColor: "transparent" },
          complete: { width: "100%", backgroundColor: "hsl(var(--primary))" },
        }}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

// ─── CheckIcon ───────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
