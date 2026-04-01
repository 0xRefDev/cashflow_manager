import Image from "next/image";
import { features } from "@/utils/FeatureData";
import GlobalConn from "@/assets/images/global_connect.png";

export function Features() {
  return (
    <section id="features" className="w-full min-h-[80dvh] mx-auto pb-10">
      <article className="flex flex-col gap-2 items-center text-center">
        <h1 className="text-xl lg:text-3xl font-bold leading-tight tracking-tight font-manrope text-pretty w-full text-center">
          Beyond a standard tracker.{" "}
          <span className="text-[#6E9BFF]">An asset.</span>
        </h1>
        <p className="text-sm lg:text-lg text-gray-300 leading-relaxed max-w-xs lg:max-w-md text-pretty text-center mx-auto">
          A suite of features designed to give you complete control over your finances.
        </p>
      </article>
      <article className="flex max-w-[1024px] mx-auto">
        <div className="w-full flex flex-col gap-6 lg:flex-row justify-center items-center">
          <ul className="flex flex-col items-center lg:items-start gap-6 pt-10">
            {features.map(({ icon, title, description }) => (
              <li key={title + icon} className="text-landing-primary flex flex-col items-center lg:items-start gap-3 lg:flex-row">
                <span>{icon}</span>
                <div className="flex flex-col gap-1">
                  <h2 className="text-white text-xl text-center lg:text-left">{title}</h2>
                  <p className="text-white/70 w-5/6 text-center lg:text-left mx-auto lg:mx-0">{description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="">
            <Image src={GlobalConn} alt="Global Connect Image" className="mx-auto w-75 lg:w-160 2xl:w-3xl rounded-xl border-2 border-landing-primary/15 shadow-lg shadow-black/40" />
          </div>
        </div>
      </article>
    </section>
  )
}