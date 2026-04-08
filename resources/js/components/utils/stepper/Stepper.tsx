import { StepperProps } from "./types";
import { StepItem } from "./StepItem";
import { canNavigateTo } from "./utils";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

/**
 * Stepper Component
 * Handles layout, progress calculation, and navigation logic
 */
export const Stepper = ({
  steps,
  currentStep,
  setStep,
  onStepChange,
  orientation = "horizontal",
  enforceValidation = false,
  className,
}: StepperProps) => {
  const isHorizontal = orientation === "horizontal";
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Centralized step change handler
   * Ensures both state update + callback fire together
   */
  const handleChange = (index: number) => {
    setStep(index);
    onStepChange?.(index);
  };

  /**
   * Keyboard navigation handler
   * Supports arrow keys for accessibility
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        handleChange(Math.min(currentStep + 1, steps.length - 1));
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        handleChange(Math.max(currentStep - 1, 0));
      }
    };

    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [currentStep, steps.length]);

  /**
   * Progress calculation
   * Converts step index into percentage
   * Used to control width/height of active line
   */
  const progress =
    steps.length <= 1
      ? 0
      : (currentStep / (steps.length - 1)) * 100;

  return (
    <div
      ref={ref}
      role="tablist"
      aria-orientation={orientation}
      tabIndex={0} // allows keyboard focus
      className={cn(
        "relative w-full",
        isHorizontal
          ? "flex items-center justify-between"
          : "flex flex-col gap-8",
        className
      )}
    >
      {/* Background Line (inactive) */}
      <div
        className={cn(
          "absolute bg-muted",
          // horizontal line centered with circles (top-5 = half of circle height)
          isHorizontal
            ? "top-5 left-0 right-0 h-[2px]"
            : "left-5 top-0 bottom-0 w-[2px]"
        )}
      />

      {/* Active Progress Line */}
      <div
        className={cn(
          "absolute bg-primary transition-all duration-500",
          isHorizontal
            ? "top-5 left-0 h-[2px]"
            : "left-5 top-0 w-[2px]"
        )}
        style={
          isHorizontal
            ? { width: `${progress}%` } // animate width
            : { height: `${progress}%` } // animate height
        }
      />

      {/* Steps Rendering */}
      {steps.map((step, index) => {
        /**
         * Determine if step is clickable
         * Uses validation + disabled logic
         */
        const clickable = canNavigateTo(
          index,
          currentStep,
          steps,
          enforceValidation
        );

        return (
          <div
            key={step.id}
            className={cn(
              "flex-1 flex",
              isHorizontal
                ? "justify-center"
                : "items-start"
            )}
          >
            <StepItem
              step={step}
              index={index}
              currentStep={currentStep}
              clickable={clickable}
              orientation={orientation}
              onClick={() =>
                clickable && handleChange(index) // prevent invalid clicks
              }
            />
          </div>
        );
      })}
    </div>
  );
};