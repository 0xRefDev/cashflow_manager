interface ToggleButtonProps {
  value: boolean;
  onChange?: (value: boolean) => void;
}

export function ToggleButton({ value, onChange }: ToggleButtonProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-1">
      <button
        onClick={() => onChange?.(!value)}
        className={`shadow-xl w-12 transition-all duration-300 h-6 rounded-full relative cursor-pointer px-1 py-0.5 ${value ? "bg-landing-primary" : "bg-[#ADAAAA]/20"}`}
      >
        <div
          className={`size-4.5 ${value ? "bg-[#005D2C] translate-x-5.5" : "bg-[#ADAAAA]/50"} rounded-full transition-all duration-300`}
        ></div>
      </button>
    </div>
  );
}