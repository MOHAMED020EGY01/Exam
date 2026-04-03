import * as React from "react"
import { VariantProps } from "class-variance-authority"
import { Button, buttonVariants } from "./button"
import { Link } from "@inertiajs/react";

interface Props
  extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
}

const LinkTo = ({
  className,
  variant = "default",
  size = "default",
  href,
  ...props
}: Props) => {
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      asChild={true}
      {...props}
    >
      <Link
        href={href}
        as="a"
        preserveScroll={false}
      >
        {props.children}
      </Link>
    </Button>
  )
}

export { LinkTo }