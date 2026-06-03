interface Level {
  name: string;
  min_score: number;
  max_score: number;
}

const levels: Level[] = [
  { name: "Beginner", min_score: 0, max_score: 100 },
  { name: "Saver", min_score: 101, max_score: 500 },
  { name: "Pro", min_score: 501, max_score: 2000 },
];

export function ReputationPBar({ score }: { score: number }) {
  const currentLevelIndex = levels.findIndex(
    (lvl) => score >= lvl.min_score && score <= lvl.max_score
  );

  const currentLevel = currentLevelIndex >= 0 
    ? levels[currentLevelIndex] 
    : levels[levels.length - 1];
  
  const nextLevel = currentLevelIndex < levels.length - 1 
    ? levels[currentLevelIndex + 1] 
    : null;

  const range = currentLevel.max_score - currentLevel.min_score;
  const progressInLevel = score - currentLevel.min_score;
  const percentage = range > 0 ? (progressInLevel / range) * 100 : 100;
  const pointsToNext = nextLevel ? nextLevel.min_score - score : 0;

  const getPositionPercent = (index: number) => {
    return (index / (levels.length - 1)) * 100;
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col gap-2 bg-[#2f2f2f] px-4 py-2 w-full rounded-lg border border-landing-primary/20">
        <div className="flex justify-between items-center text-sm">
          <span className="text-landing-primary font-semibold">
            {currentLevel.name}
          </span>
          <span className="text-white/70">
            {score}/{currentLevel.max_score} pts
          </span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-linear-to-tr from-landing-primary to-[#B4CD46] h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {nextLevel ? (
          <span className="text-xs text-white/50">
            {pointsToNext} pts to {nextLevel.name}
          </span>
        ) : (
          <span className="text-xs text-landing-primary">
            Max level reached!
          </span>
        )}
      </div>

      <div className="relative h-6 mt-1">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 mt-1 w-full mx-auto" />
        
        <div className="absolute top-1/2 left-0 right-0 h-0">
          {levels.map((lvl, i) => (
            <div
              key={i}
              className="group flex flex-col items-center cursor-pointer"
              style={{ position: 'absolute', left: `${getPositionPercent(i)}%`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border-2 ${
                  score >= lvl.min_score && score <= lvl.max_score
                    ? "bg-landing-primary border-landing-primary"
                    : score > lvl.max_score
                    ? "bg-landing-primary/50 border-landing-primary/50"
                    : "bg-[#5b5a5a] border-white/30"
                }`}
              />
              
              {/* Tooltip */}
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 border border-white/20 rounded-md px-2 py-1 pointer-events-none whitespace-nowrap z-10 backdrop-blur-xl flex justify-center items-center">
                <span className="text-[10px] text-white/80">
                  {i === 0 ? `Start: ${lvl.min_score}pts` : `Needs min ${lvl.min_score}pts`}
                </span>
              </div>
              <span className={`text-[10px] mt-1 ${
                score >= lvl.min_score && score <= lvl.max_score
                  ? "text-landing-primary"
                  : "text-white/40"
              }`}>
                {lvl.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}