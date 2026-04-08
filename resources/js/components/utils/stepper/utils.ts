/**
 * Check if step is completed
 * Completed = index < currentStep
 */
export const isCompleted = (index: number, current: number) =>
  index < current;

/**
 * Check if step is active
 */
export const isActive = (index: number, current: number) =>
  index === current;

/**
 * Determines if user can navigate to a step
 *
 * Rules:
 * - Disabled steps are never clickable
 * - Backward navigation is always allowed
 * - Forward navigation depends on validation
 */
export const canNavigateTo = (
  index: number,
  current: number,
  steps: { isValid?: boolean; disabled?: boolean }[],
  enforceValidation?: boolean
) => {
  if (steps[index]?.disabled) return false;

  if (index <= current) return true;

  if (!enforceValidation) return true;

  // ensures all previous steps are valid
  return steps.slice(0, index).every((s) => s.isValid !== false);
};