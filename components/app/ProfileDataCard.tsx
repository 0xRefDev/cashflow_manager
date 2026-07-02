"use client";

export function ProfileDataCard({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
    return (
        <div className={`p-6 rounded-2xl bg-white/5 border border-white/10 ${className || ''}`}>
            <h3 className="text-sm font-medium mb-4 tracking-[1.5px] uppercase">{title}</h3>
            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    );
}