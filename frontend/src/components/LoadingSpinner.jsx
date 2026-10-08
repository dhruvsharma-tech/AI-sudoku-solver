import { useEffect, useState } from 'react';

const STEPS = [
  'Detecting Sudoku grid...',
  'Recognizing digits with CNN...',
  'Solving puzzle with backtracking...',
  'Generating solution image...',
];

export default function LoadingSpinner() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in">
      <div className="glass-card p-10 flex flex-col items-center text-center">
        {/* Spinner rings */}
        <div className="relative w-20 h-20 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-400 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600/30 to-pink-500/30 animate-pulse-slow" />
        </div>

        <h3 className="text-xl font-semibold text-slate-200 mb-2">Solving your Sudoku</h3>
        <p className="text-purple-400 text-sm font-medium mb-8 min-h-[1.25rem] transition-all duration-500">
          {STEPS[stepIndex]}
        </p>

        {/* Step indicators */}
        <div className="flex gap-3">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= stepIndex
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                  : 'bg-white/10 w-4'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
