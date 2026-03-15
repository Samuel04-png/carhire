import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[15px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/30 disabled:pointer-events-none disabled:bg-[var(--color-gray-300)] disabled:text-[var(--color-gray-600)] disabled:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-accent)] text-white shadow-[0_4px_14px_rgba(26,127,212,0.4)] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(26,127,212,0.6)] hover:bg-[var(--color-accent-hover)]",
        dark: "bg-[var(--color-primary)] text-white hover:-translate-y-[2px] hover:shadow-lg",
        secondary: "bg-transparent text-[var(--color-accent)] border-2 border-[var(--color-accent)] hover:-translate-y-[2px] hover:bg-[var(--color-accent)]/8",
        ghost: "bg-transparent text-white border-2 border-white/40 hover:-translate-y-[2px] hover:bg-white/10",
        danger: "bg-[var(--color-error)] text-white hover:-translate-y-[2px] hover:shadow-lg",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-14 rounded-lg px-8",
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
