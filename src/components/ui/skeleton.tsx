import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-md bg-gradient-to-r from-white/[0.04] via-green-500/[0.06] to-white/[0.04] bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
