"use client";

export function ProfileDataCard({ title, children }: { title: string; children: React.ReactNode; }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium mb-4 tracking-[1.5px] uppercase">{title}</h3>
            <div className="flex flex-col gap-3">
                {children}
            </div>
        </div>
    );
}