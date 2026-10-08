const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

console.log('[API] API_URL configured as:', API_URL);

/**
 * Upload a Sudoku image → receive solved PNG blob
 * @param {File} imageFile
 * @returns {Promise<string>} Object URL of solved PNG
 */
export const solveSudokuImage = async (imageFile) => {
  console.log('[API] ▶ Step 1: Starting solve request');
  console.log('[API]   File info:', {
    name: imageFile.name,
    size: `${(imageFile.size / 1024).toFixed(1)} KB`,
    type: imageFile.type,
  });

  const formData = new FormData();
  formData.append('image', imageFile);

  const endpoint = `${API_URL}/api/solve-image`;
  console.log('[API]   POST →', endpoint);

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
  } catch (networkErr) {
    console.error('[API] ✗ Network error (server unreachable?):', networkErr.message);
    throw new Error(`Network error: Cannot reach backend at ${API_URL}. Is Node.js server running?`);
  }

  console.log('[API] ▶ Step 2: Got response');
  console.log('[API]   Status:', response.status, response.statusText);
  console.log('[API]   Content-Type:', response.headers.get('content-type'));

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}: Something went wrong`;
    let errData = null;
    try {
      errData = await response.json();
      console.error('[API] ✗ Error response body:', errData);
      errorMsg = errData.error || errData.details || errorMsg;
      if (errData.step) console.error('[API]   Failed at step (URL):', errData.step);
      if (errData.details) console.error('[API]   Details:', errData.details);
    } catch {
      const rawText = await response.text();
      console.error('[API] ✗ Error response (raw text):', rawText);
      errorMsg = rawText || errorMsg;
    }
    throw new Error(errorMsg);
  }

  console.log('[API] ▶ Step 3: Reading response as blob...');
  const blob = await response.blob();
  console.log('[API]   Blob size:', blob.size, 'bytes, type:', blob.type);

  if (blob.size === 0) {
    console.error('[API] ✗ Received empty blob!');
    throw new Error('Server returned empty image');
  }

  const objectUrl = URL.createObjectURL(blob);
  console.log('[API] ✓ Success! Object URL created:', objectUrl);
  return objectUrl;
};
