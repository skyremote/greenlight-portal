import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500 disabled:pointer-events-none disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-green-600 text-white shadow-md shadow-green-500/15 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25",
        secondary:
          "bg-white/[0.06] text-gray-200 shadow-sm border border-white/[0.06] hover:bg-white/[0.1] hover:border-white/[0.1]",
        ghost:
          "text-gray-300 hover:bg-white/[0.06] hover:text-gray-100",
        destructive:
          "bg-red-700 text-white shadow-sm hover:bg-red-600 hover:shadow-md hover:shadow-red-500/20",
        outline:
          "border border-white/[0.1] bg-transparent text-gray-200 shadow-sm hover:bg-white/[0.04] hover:border-white/[0.15]",
        link:
          "text-green-500 underline-offset-4 hover:underline hover:scale-100 active:scale-100",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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
