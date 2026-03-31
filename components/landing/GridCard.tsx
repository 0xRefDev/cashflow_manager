export function GridCard({ icon, title, description, color, className }: { icon: React.ReactNode, title: string, description: string, color: string, className?: string }) {
  return (
    <div className={`flex flex-col items-start bg-[#1a1a1aa1] backdrop-blur-sm p-5 rounded-lg shadow-lg shadow-black/15 border border-landing-primary/10 ${className}`}>
      <div style={{ color }} className={`size-10 rounded-xl flex items-center justify-center bg-white/10 mb-5 mx-auto lg:mx-0`}>{icon}</div>
      <h3 className="text-xl lg:text-xl font-bold leading-tight tracking-tight font-manrope text-pretty mb-0.5">{title}</h3>
      <p className="text-sm lg:text-[0.90rem] text-gray-300 leading-relaxed mt-1 lg:mt-0 max-w-xs lg:max-w-md text-pretty">{description}</p>
    </div>
  )
}