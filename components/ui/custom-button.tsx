import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const CustomButton = forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#85E8EA] disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "gradient-button text-gray-900 shadow-lg hover:shadow-xl",
      secondary: "bg-white text-[#85E8EA] border-2 border-[#85E8EA] hover:bg-[#85E8EA] hover:text-white hover:shadow-lg",
      outline: "bg-transparent text-[#85E8EA] border border-[#85E8EA] hover:bg-[#85E8EA] hover:text-white",
      ghost: "bg-transparent text-gray-700 hover:bg-[#85E8EA]/10 hover:text-[#85E8EA]"
    }
    
    const sizes = {
      sm: "px-4 py-2 text-sm rounded-lg",
      md: "px-6 py-3 text-base rounded-xl",
      lg: "px-8 py-4 text-lg rounded-2xl"
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

CustomButton.displayName = "CustomButton"

export { CustomButton }
