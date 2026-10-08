export default function Header() {
  return (
    <header className="text-center py-12 px-4 animate-fade-in">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center glow-purple">
          <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3.375 3h17.25M3.375 3v17.25M3.375 3H3m17.25 0H21m0 0v17.25M21 20.25H3m18-18v.375M3 3v.375m0 16.5H3m0-16.875v16.5M21 3.375v16.5M3.375 21h17.25"
            />
            <rect x="7" y="7" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
            <rect x="11" y="7" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="15" y="7" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
            <rect x="7" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="11" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
            <rect x="15" y="11" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="7" y="15" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
            <rect x="11" y="15" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.4"/>
            <rect x="15" y="15" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.8"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
        Sudoku Solver
      </h1>
      <p className="text-slate-400 text-lg max-w-md mx-auto">
        Upload a Sudoku image and get it solved instantly using AI-powered digit recognition.
      </p>

    </header>
  );
}
