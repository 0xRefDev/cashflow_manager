"use client";

interface UnderDevelopmentProps {
  className?: string;
  showIcon?: boolean;
  message?: string;
  children?: React.ReactNode;
}

export function UnderDevelopment({ 
  className = "", 
  showIcon = true, 
  message = "Under Development",
  children 
}: UnderDevelopmentProps) {
  return (
    <div className={`group relative overflow-hidden rounded-lg ${className}`}>
      <div className="relative overflow-hidden bg-amber-300 py-2 px-4">
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/30 to-transparent" />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 10px, #000 10px, #000 20px)',
          }}
        />

        <div className="relative flex items-center justify-center gap-2">
          {showIcon && (
            <svg 
              className="w-4 h-4 text-black" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          )}
          <span className="text-black font-bold uppercase tracking-widest text-sm">
            {message}
          </span>
        </div>
      </div>

      {children && (
        <div className="bg-white/5 border border-white/10 p-4">
          {children}
        </div>
      )}
    </div>
  );
}