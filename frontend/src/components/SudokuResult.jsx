export default function SudokuResult({ originalPreview, solvedUrl, onReset }) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = solvedUrl;
    link.download = 'solved_sudoku.png';
    link.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-slide-up">
      {/* Success banner */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
        </div>
        <span className="text-green-400 font-semibold">Sudoku Solved Successfully!</span>
      </div>

      {/* Image comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Original */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Original</span>
          </div>
          <div className="rounded-xl overflow-hidden bg-black/20">
            <img
              src={originalPreview}
              alt="Original Sudoku"
              className="w-full object-contain max-h-72"
            />
          </div>
        </div>

        {/* Solved */}
        <div className="glass-card p-5 border-purple-500/30">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Solved ✨</span>
          </div>
          <div className="rounded-xl overflow-hidden bg-black/20">
            <img
              src={solvedUrl}
              alt="Solved Sudoku"
              className="w-full object-contain max-h-72"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          id="download-btn"
          onClick={handleDownload}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Solution
        </button>
        <button
          id="try-another-btn"
          onClick={onReset}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Another
        </button>
      </div>
    </div>
  );
}
