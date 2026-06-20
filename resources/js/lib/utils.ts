/**
 * utils.ts
 *
 * Purpose:
 * Small utility classes supporting styling helpers.
 *
 * Responsibilities:
 * - Dynamically join conditional classnames and resolve tailwind css conflicts (cn helper)
 *
 * Dependencies:
 * - clsx
 * - tailwind-merge
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
