import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/35 disabled:pointer-events-none disabled:bg-[var(--color-gray-300)] disabled:text-[var(--color-gray-600)] disabled:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-accent)] text-white shadow-sm hover:bg-[var(--color-accent-hover)]",
        dark: "bg-[var(--color-primary)] text-white shadow-sm hover:bg-[#102d48]",
        secondary: "border border-[var(--color-gray-300)] bg-white text-[var(--color-primary)] shadow-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
        ghost: "border border-white/25 bg-transparent text-white hover:bg-white/10",
        danger: "bg-[var(--color-error)] text-white shadow-sm hover:bg-[#dc2626]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-md px-7",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
