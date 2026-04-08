import { ReactNode } from "react";

/**
 * Represents a single step in the Stepper
 */
export interface Step {
  id: string; // unique identifier (used as key)
  title: string; // main label
  description?: string; // optional sub text
  icon?: ReactNode; // optional custom icon
  disabled?: boolean; // prevents interaction
  isValid?: boolean; // used for validation gating
}

/**
 * Main Stepper props (controlled component)
 */
export interface StepperProps {
  steps: Step[]; // list of steps
  currentStep: number; // active step index
  setStep: (step: number) => void; // external state setter
  onStepChange?: (step: number) => void; // optional side effect

  orientation?: "horizontal" | "vertical"; // layout mode
  enforceValidation?: boolean; // block forward navigation

  className?: string; // custom styles
}