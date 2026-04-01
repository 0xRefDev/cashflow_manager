import { GridCard } from "@/components/landing/GridCard";
import { gridCards } from "@/utils/HowItWorksData";

export function HowItWork() {
  return (
    <section
      id="how-it-works"
      className="w-full pt-24 relative z-10 min-h-[80dvh] max-w-[1024px] mx-auto py-20 md:pt-28 lg:pt-32"
    >
      <div className="hidden lg:block absolute -left-80 top-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-[#215b9515] rounded-full blur-3xl pointer-events-none" />

      <article className="flex flex-col justify-center xl:justify-start">
        <div className="flex px-4 lg:px-5 justify-start text-center">
          <h2 className="text-xl lg:text-3xl font-bold leading-tight tracking-tight font-manrope text-pretty">The precision tool for <span className="text-landing-primary underline underline-offset-4">financial clarity</span></h2>
        </div>
        <section className="grid grid-cols-1 grid-rows-4 lg:grid-cols-3 lg:grid-rows-2 px-6 py-6 gap-4">
          {gridCards.map(({ icon, title, description, color, className }) => (
            <GridCard icon={icon} title={title} description={description} color={color} className={className} key={title + icon} />
          ))}
        </section>
      </article>
    </section>
  )
}