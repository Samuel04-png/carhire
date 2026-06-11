import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-md)] text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(22,119,210,0.14)] disabled:pointer-events-none disabled:bg-[var(--color-gray-300)] disabled:text-[var(--color-gray-600)] disabled:shadow-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand)] text-white shadow-[var(--shadow-button)] hover:-translate-y-0.5 hover:bg-[var(--brand-dark)] hover:shadow-[0_12px_24px_rgba(22,119,210,0.28)]",
        dark: "bg-[var(--bg-sidebar)] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#102d48]",
        secondary: "border border-[var(--border-soft)] bg-white text-[var(--text-main)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-dark)]",
        ghost: "border border-white/20 bg-transparent text-white hover:bg-white/10",
        danger: "bg-[var(--danger-ui)] text-white shadow-sm hover:-translate-y-0.5 hover:bg-[#dc2626]",
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
