type CardVariant = "income" | "expense" | "net";

const variantStyles: Record<
  CardVariant,
  {
    color: string;
    secondary_color: string;
    icon: string;
    iconBg: string;
    subtitle: string;
    glow1: string;
    glow2: string;
  }
> = {
  income: {
    color: "text-white",
    icon: "bg-landing-primary/8 text-landing-primary font-semibold text-sm rounded-xl border border-landing-primary/50",
    secondary_color: "bg-landing-primary/20 text-landing-primary/80 px-2 rounded-full border border-landing-primary/50",
    iconBg: "bg-landing-primary/10",
    subtitle: "",
    glow1: "bg-landing-primary/50",
    glow2: "bg-landing-primary/8",
  },
  expense: {
    color: "text-white",
    icon: "text-[#FF7351]/60 bg-[#FF7351]/8 font-semibold text-sm rounded-xl border border-[#FF7351]/50",
    secondary_color: "bg-[#FF7351]/8 text-[#FF8A6D] px-2 rounded-full border border-[#FF7351]/50",
    iconBg: "bg-[#FF7351]/10",
    subtitle: "",
    glow1: "bg-[#FF7351]/70",
    glow2: "bg-[#FF7351]/8",
  },
  net: {
    color: "text-landing-primary",
    icon: "text-[#004820] bg-[#13EA79] font-semibold rounded-xl border border-[#004820]",
    secondary_color: "bg-landing-primary/10 text-landing-primary/80 px-2 rounded-full border border-landing-primary/50 text-sm py-0.5",
    iconBg: "bg-landing-primary/20",
    subtitle: "hidden",
    glow1: "bg-landing-primary/30",
    glow2: "bg-indigo-500/10",
  },
};

export function InfoCard({
  title,
  subtitle,
  icon,
  total,
  variant,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  total: string | number;
  variant: CardVariant;
}) {
  const styles = variantStyles[variant];

  return (
    <>
      <article className="overflow-hidden border border-landing-primary/5 py-5 px-4 bg-[#131313] rounded-4xl shadow-2xl flex flex-col gap-4 relative hover:border-landing-primary/12.5 transition-colors">
        <div className={`absolute right-[5%] bottom-[50%] size-17.5 ${styles.glow1} blur-[60px] rounded-full pointer-events-none`} />
        <div className={`absolute right-[25%] bottom-[10%] size-15 ${styles.glow2} blur-2xl rounded-full pointer-events-none`} />

        <div className={`flex items-center gap-2 bg-black/35 p-2 rounded-xl relative z-10`}>
          <span className={`size-10 flex justify-center items-center uppercase ${styles.icon}`}>{icon}</span>
          <div className="flex flex-col">
            <span className={`text-sm font-medium font-inter`}>
              {title}
            </span>
            <p className={`text-sm text-[#ADAAAA]`}>On this period</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className={`text-2xl font-bold ${styles.color}`}>${total}</span>
        </div>

        <div className={`flex items-center gap-2 w-fit uppercase`}>
          <span className={`flex gap-2 justify-center items-center ${styles.secondary_color}`}>
            {icon}{subtitle}
          </span>
          <span className={`lowercase text-xs text-[#ADAAAA] ${styles.subtitle}`}>vs previous period</span>
        </div>

      </article>
    </>
  );
}