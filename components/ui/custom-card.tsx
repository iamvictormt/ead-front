import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface CustomCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'elevated'
  children: React.ReactNode
}

const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: "ead-card",
      gradient: "gradient-card text-white shadow-xl",
      elevated: "ead-card shadow-2xl border-2 border-[#85E8EA]/30"
    }
    
    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CustomCard.displayName = "CustomCard"

export { CustomCard }
