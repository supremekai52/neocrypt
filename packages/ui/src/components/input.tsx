import * as React from "react"
import { cn } from "../utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  glass?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, glass, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          glass && "glass backdrop-blur-sm bg-white/10 text-white placeholder:text-white/60 border-white/20",
          !glass && "bg-background",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }