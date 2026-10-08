export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="glass-card p-10 flex flex-col items-center text-center border-red-500/20">
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-slate-200 mb-2">Couldn't Solve Sudoku</h3>
        <p className="text-slate-400 text-sm mb-2 max-w-sm leading-relaxed">
          {message || 'An unexpected error occurred. Please try with a clearer image.'}
        </p>

        {/* Tips */}
        <div className="w-full bg-white/3 rounded-xl p-4 mb-6 text-left border border-white/5">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Tips for best results</p>
          <ul className="text-slate-400 text-sm space-y-1">
            <li className="flex gap-2"><span className="text-purple-400">•</span> Use a clear, well-lit image</li>
            <li className="flex gap-2"><span className="text-purple-400">•</span> Make sure the grid is fully visible</li>
            <li className="flex gap-2"><span className="text-purple-400">•</span> Avoid blurry or tilted photos</li>
            <li className="flex gap-2"><span className="text-purple-400">•</span> Plain backgrounds work best</li>
          </ul>
        </div>

        <button
          id="retry-btn"
          onClick={onRetry}
          className="btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </button>
      </div>
    </div>
  );
}
