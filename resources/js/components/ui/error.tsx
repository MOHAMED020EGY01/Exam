import * as React from "react"
import { cn } from "@/lib/utils"

type ErrorProps = {
  message?: string
} & React.HTMLAttributes<HTMLParagraphElement>

function Error({ message, className, ...props }: ErrorProps) {
  if (!message) return null

  return (
    <p
      data-slot="error"
      className={cn(
        "text-sm text-error mt-1",
        className
      )}
      {...props}
    >
      {message}
    </p>
  )
}

export { Error }
