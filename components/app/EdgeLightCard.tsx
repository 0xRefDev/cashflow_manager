export function EdgeLightCard({ icon, title, description, className, iconClassName }: { icon: React.ReactNode, title: string, description: string, className?: string, iconClassName?: string }) {
  return (
    <>
      <div className={`relative overflow-hidden group p-2.5 lg:p-4 rounded-xl bg-white/3 border-l-3 border w-fit border-white/5 flex items-start gap-4 ${className} shadow-2xl shadow-black/40`}>
        <div className={`p-2 lg:p-3 rounded-lg ${iconClassName}`}>
          {icon}
        </div>
        <div className="flex flex-col gap-1 pr-2 lg:pr-12 text-pretty">
          <h4 className="font-bold text-lg">{title}</h4>
          <p className="text-sm text-[#ADAAAA]">{description}</p>
        </div>
      </div>
    </>
  )
}