import { useRef, useState, useCallback } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
const MAX_SIZE_MB = 10;

export default function ImageUploader({ onSolve, isLoading }) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const inputRef = useRef(null);

  const validateAndSet = (f) => {
    setFileError('');
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setFileError('Only JPEG, PNG, BMP, or WebP images are allowed.');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) validateAndSet(dropped);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) validateAndSet(selected);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setFileError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleSolve = () => {
    if (file && onSolve) onSolve(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      {!preview ? (
        /* ── Drop Zone ── */
        <div
          id="drop-zone"
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`glass-card p-12 flex flex-col items-center justify-center cursor-pointer
            transition-all duration-300 text-center
            ${dragOver
              ? 'border-purple-500 bg-purple-500/10 glow-purple scale-[1.02]'
              : 'hover:border-purple-500/50 hover:bg-white/8'
            }`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5
            transition-all duration-300
            ${dragOver ? 'bg-purple-500/30' : 'bg-white/5'}`}>
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-slate-200 font-semibold text-lg mb-1">
            {dragOver ? 'Drop it here!' : 'Drag & drop your Sudoku image'}
          </p>
          <p className="text-slate-500 text-sm mb-4">or click to browse</p>
          <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-500">
            JPEG · PNG · BMP · WebP &nbsp;|&nbsp; Max 10MB
          </span>

          {fileError && (
            <p className="mt-4 text-red-400 text-sm">{fileError}</p>
          )}
        </div>
      ) : (
        /* ── Preview ── */
        <div className="glass-card p-6 animate-slide-up">
          <div className="relative rounded-xl overflow-hidden mb-5 bg-black/20">
            <img
              src={preview}
              alt="Selected Sudoku"
              className="w-full max-h-80 object-contain"
            />
            <button
              id="remove-image-btn"
              onClick={handleRemove}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center
                justify-center text-white hover:bg-red-500/80 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-400 mb-5 px-1">
            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="truncate">{file?.name}</span>
            <span className="flex-shrink-0 text-slate-600">
              ({(file?.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>

          <button
            id="solve-btn"
            onClick={handleSolve}
            disabled={isLoading}
            className="btn-primary w-full text-center"
          >
            {isLoading ? 'Solving...' : '✨ Solve Sudoku'}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/bmp,image/webp"
        className="hidden"
        onChange={handleFileChange}
        id="file-input"
      />
    </div>
  );
}
