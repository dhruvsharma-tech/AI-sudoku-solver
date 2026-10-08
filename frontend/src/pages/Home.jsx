import { useState } from 'react';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import SudokuResult from '../components/SudokuResult';
import ErrorMessage from '../components/ErrorMessage';
import { solveSudokuImage } from '../services/api';

const STATE = { IDLE: 'idle', LOADING: 'loading', RESULT: 'result', ERROR: 'error' };

export default function Home() {
  const [appState, setAppState] = useState(STATE.IDLE);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [solvedUrl, setSolvedUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSolve = async (imageFile) => {
    // Store original preview before solving
    setOriginalPreview(URL.createObjectURL(imageFile));
    setAppState(STATE.LOADING);

    try {
      const resultUrl = await solveSudokuImage(imageFile);
      setSolvedUrl(resultUrl);
      setAppState(STATE.RESULT);
    } catch (err) {
      setErrorMessage(err.message);
      setAppState(STATE.ERROR);
    }
  };

  const handleReset = () => {
    // Revoke blob URLs to free memory
    if (originalPreview) URL.revokeObjectURL(originalPreview);
    if (solvedUrl) URL.revokeObjectURL(solvedUrl);

    setOriginalPreview(null);
    setSolvedUrl(null);
    setErrorMessage('');
    setAppState(STATE.IDLE);
  };

  return (
    <main className="min-h-screen bg-bg px-4 pb-16">
      {/* Background gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {appState === STATE.IDLE && (
          <ImageUploader onSolve={handleSolve} isLoading={false} />
        )}
        {appState === STATE.LOADING && (
          <LoadingSpinner />
        )}
        {appState === STATE.RESULT && (
          <SudokuResult
            originalPreview={originalPreview}
            solvedUrl={solvedUrl}
            onReset={handleReset}
          />
        )}
        {appState === STATE.ERROR && (
          <ErrorMessage message={errorMessage} onRetry={handleReset} />
        )}
      </div>
    </main>
  );
}
