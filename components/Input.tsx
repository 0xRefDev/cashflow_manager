export function Input({ type, placeholder, className, id, value, onChange, name }: { type: string, placeholder: string, className?: string, id: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-[#111111] border border-white/5 rounded-xl py-2 px-4 text-white placeholder-gray-500 outline-none hover:border-white/10 focus:border-[#4ade80]/50 focus:ring-1 focus:ring-[#4ade80]/20 transition-all duration-300 ${className}`}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    />
  )
}