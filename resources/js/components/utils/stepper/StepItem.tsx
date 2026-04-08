import { Check } from "lucide-react";
import { Step } from "./types";
import { isActive, isCompleted } from "./utils";
import { cn } from "@/lib/utils";

interface Props {
  step: Step;
  index: number;
  currentStep: number;
  onClick: () => void;
  clickable: boolean;
  orientation: "horizontal" | "vertical";
}

/**
 * StepItem
 * Renders a single step (circle + label)
 */
export const StepItem = ({
  step,
  index,
  currentStep,
  onClick,
  clickable,
  orientation,
}: Props) => {
  // determine visual state
  const active = isActive(index, currentStep);
  const completed = isCompleted(index, currentStep);

  return (
    <button
      onClick={onClick}
      disabled={!clickable}
      role="tab" // accessibility: behaves like tab
      aria-selected={active}
      className={cn(
        "group relative flex outline-none transition-all",
        // layout depends on orientation
        orientation === "horizontal"
          ? "flex-col items-center text-center"
          : "flex-row items-start gap-3",
        // shadcn focus ring
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      )}
    >
      {/* Step Circle */}
      <div
        className={cn(
          "z-10 flex items-center justify-center rounded-full border text-sm font-medium",
          "h-8 w-8 transition-all duration-300",

          // completed state → primary filled
          completed &&
            "bg-primary text-primary-foreground border-primary",

          // active state → highlighted ring
          active &&
            "bg-muted ring-2 ring-primary ring-offset-2 border-primary",

          // upcoming state → muted
          !active &&
            !completed &&
            "bg-muted text-muted-foreground border-border",

          // disabled styling
          clickable ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
        )}
      >
        {/* show check if completed, otherwise icon or step number */}
        {completed ? <Check className="h-4 w-4" /> : step.icon ?? index + 1}
      </div>

      {/* Label Section */}
      <div
        className={cn(
          "mt-2",
          // vertical layout removes top margin
          orientation === "vertical" && "mt-0 text-left"
        )}
      >
        <div
          className={cn(
            "text-sm font-medium",
            // active/completed use default foreground
            active && "text-foreground",
            completed && "text-foreground",
            // upcoming muted
            !active && !completed && "text-muted-foreground"
          )}
        >
          {step.title}
        </div>

        {step.description && (
          <div className="text-xs text-muted-foreground">
            {step.description}
          </div>
        )}
      </div>
    </button>
  );
};