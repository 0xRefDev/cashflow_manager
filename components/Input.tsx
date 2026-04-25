import { forwardRef } from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        autoComplete="false"
        className={`w-full bg-[#111111] border border-white/5 rounded-xl py-2 px-4 text-white placeholder-gray-500 outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"