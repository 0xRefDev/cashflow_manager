import { Check } from "@/icons/Check";

export function StepsMark({ currentStep, isCompleted }: { currentStep: number, isCompleted?: boolean }) {
  return (
    <article className="bg-[#13261A]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex w-fit items-center gap-4 self-start md:self-auto transition-all duration-500 animate-fade">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] text-landing-primary uppercase">
          Step {currentStep} of 3
        </span>
        
        {isCompleted && (
          <>
            <div className="w-px h-3 bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="bg-landing-primary rounded-full p-0.5">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-landing-primary uppercase">Completed</span>
            </div>
          </>
        )}
      </div>

      {!isCompleted && (
        <div className="flex gap-1.5">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === 1 ? 'bg-landing-primary w-8' : 'bg-white/10 w-4'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === 2 ? 'bg-landing-primary w-8' : 'bg-white/10 w-4'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${currentStep === 3 ? 'bg-landing-primary w-8' : 'bg-white/10 w-4'}`}></div>
        </div>
      )}
    </article>
  )
}