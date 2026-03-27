interface PillProps {
  children: string;
  className?: string;
}

export function Pill({ children, className }: PillProps) {
  return (
    <span className={`text-landing-primary text-xs font-manrope bg-landing-primary/10 px-3 py-1 rounded-full border border-landing-primary/20 w-fit shadow-lg shadow-landing-primary/4 backdrop-blur-xs ${className}`}>
      {children}
    </span>
  )
}