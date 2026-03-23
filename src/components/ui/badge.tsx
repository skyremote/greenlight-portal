import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-green-600 text-white shadow-sm shadow-green-500/20",
        secondary:
          "border-transparent bg-white/[0.06] text-gray-200",
        destructive:
          "border-transparent bg-red-700 text-white shadow-sm shadow-red-500/20",
        outline:
          "border-white/[0.1] text-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
