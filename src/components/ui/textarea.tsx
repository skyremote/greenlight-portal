import * as React from "react"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-gray-200 shadow-sm transition-all duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:border-green-500/50 focus-visible:ring-1 focus-visible:ring-green-500/30 focus-visible:shadow-[0_0_12px_rgba(34,197,94,0.15)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
