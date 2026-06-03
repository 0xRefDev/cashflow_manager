import { Button } from "@/components/Button";

interface FloatingContainerProps {
  onSave: () => void;
  onDiscard: () => void;
}

export function FloatingContainer({ onSave, onDiscard }: FloatingContainerProps) {
  return (
    <section className="fixed top-22 right-6 z-9999 bg-[#1A1A1A]/80 backdrop-blur-sm rounded-lg shadow-lg p-4 flex gap-3 items-center border border-landing-primary/10">
      <p className="text-white text-sm">You have unsaved changes</p>
      <Button onClick={onDiscard} className="text-[#ADAAAA] text-sm">
        Discard
      </Button>
      <Button className="bg-landing-primary text-[#02361A] text-sm px-4 py-1.5 rounded-md" onClick={onSave}>
        Save
      </Button>
    </section>
  );
}