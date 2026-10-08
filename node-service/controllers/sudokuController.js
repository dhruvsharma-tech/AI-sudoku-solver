const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
const JAVA_SERVICE_URL   = process.env.JAVA_SERVICE_URL   || 'http://localhost:8080';

console.log('[Node] Services configured:');
console.log('  Python →', PYTHON_SERVICE_URL);
console.log('  Java   →', JAVA_SERVICE_URL);

/** Helper: current timestamp for logs */
const ts = () => new Date().toISOString();

/**
 * POST /api/solve-image
 *
 * Flow:
 *  1. Image → Python /extract-grid  → unsolved grid (9x9)
 *  2. Grid  → Java   /api/sudoku/solve → solved grid (9x9)
 *  3. Grid  → Python /generate-image   → solved PNG image
 *  4. PNG image → client
 */
exports.solveSudokuFromImage = async (req, res) => {
    const requestId = Date.now();
    const imagePath = req.file ? req.file.path : null;

    console.log(`\n[Node][${requestId}] ━━━ New request received ━━━`);
    console.log(`[Node][${requestId}] Time: ${ts()}`);
    console.log(`[Node][${requestId}] File:`, req.file
        ? { originalname: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype, path: req.file.path }
        : 'NO FILE');

    try {
        if (!imagePath) {
            console.error(`[Node][${requestId}] ✗ No image file in request!`);
            return res.status(400).json({ error: 'Image file required. Field name: "image"' });
        }

        // ─────────────────────────────────────────
        // STEP 1: Python → extract grid from image
        // ─────────────────────────────────────────
        const step1Start = Date.now();
        console.log(`\n[Node][${requestId}] ▶ STEP 1: Sending image to Python @ ${PYTHON_SERVICE_URL}/extract-grid`);

        const formData = new FormData();
        formData.append('file', fs.createReadStream(imagePath));

        let extractResponse;
        try {
            extractResponse = await axios.post(
                `${PYTHON_SERVICE_URL}/extract-grid`,
                formData,
                { headers: formData.getHeaders(), timeout: 180000 }
            );
        } catch (err) {
            const errBody = err.response?.data
                ? (Buffer.isBuffer(err.response.data)
                    ? err.response.data.toString('utf8')
                    : JSON.stringify(err.response.data))
                : err.message;
            console.error(`[Node][${requestId}] ✗ STEP 1 FAILED (${Date.now() - step1Start}ms)`);
            console.error(`[Node][${requestId}]   Status: ${err.response?.status}`);
            console.error(`[Node][${requestId}]   Body:   ${errBody}`);
            console.error(`[Node][${requestId}]   URL:    ${err.config?.url}`);
            throw err;
        }

        const unsolvedGrid = extractResponse.data.grid;
        console.log(`[Node][${requestId}] ✓ STEP 1 done (${Date.now() - step1Start}ms)`);
        console.log(`[Node][${requestId}]   Grid extracted:`);
        unsolvedGrid.forEach((row, i) =>
            console.log(`[Node][${requestId}]   Row ${i}: [${row.join(', ')}]`)
        );

        // ─────────────────────────────────────────
        // STEP 2: Java → solve the grid
        // ─────────────────────────────────────────
        const step2Start = Date.now();
        console.log(`\n[Node][${requestId}] ▶ STEP 2: Sending grid to Java @ ${JAVA_SERVICE_URL}/api/sudoku/solve`);
        console.log(`[Node][${requestId}]   Payload:`, JSON.stringify({ grid: unsolvedGrid }));

        let solveResponse;
        try {
            solveResponse = await axios.post(
                `${JAVA_SERVICE_URL}/api/sudoku/solve`,
                { grid: unsolvedGrid },
                { timeout: 60000 }
            );
        } catch (err) {
            const errBody = err.response?.data
                ? (Buffer.isBuffer(err.response.data)
                    ? err.response.data.toString('utf8')
                    : JSON.stringify(err.response.data))
                : err.message;
            console.error(`[Node][${requestId}] ✗ STEP 2 FAILED (${Date.now() - step2Start}ms)`);
            console.error(`[Node][${requestId}]   Status: ${err.response?.status}`);
            console.error(`[Node][${requestId}]   Body:   ${errBody}`);
            console.error(`[Node][${requestId}]   URL:    ${err.config?.url}`);
            throw err;
        }

        const solvedGrid = solveResponse.data.grid;
        console.log(`[Node][${requestId}] ✓ STEP 2 done (${Date.now() - step2Start}ms) - Sudoku solved!`);
        console.log(`[Node][${requestId}]   Solved grid:`);
        solvedGrid.forEach((row, i) =>
            console.log(`[Node][${requestId}]   Row ${i}: [${row.join(', ')}]`)
        );

        // ─────────────────────────────────────────
        // STEP 3: Python → generate solved image
        // ─────────────────────────────────────────
        const step3Start = Date.now();
        console.log(`\n[Node][${requestId}] ▶ STEP 3: Sending solved grid to Python @ ${PYTHON_SERVICE_URL}/generate-image`);

        let imageResponse;
        try {
            imageResponse = await axios.post(
                `${PYTHON_SERVICE_URL}/generate-image`,
                { grid: solvedGrid },
                { responseType: 'arraybuffer', timeout: 15000 }
            );
        } catch (err) {
            const errBody = err.response?.data
                ? (Buffer.isBuffer(err.response.data)
                    ? err.response.data.toString('utf8')
                    : JSON.stringify(err.response.data))
                : err.message;
            console.error(`[Node][${requestId}] ✗ STEP 3 FAILED (${Date.now() - step3Start}ms)`);
            console.error(`[Node][${requestId}]   Status: ${err.response?.status}`);
            console.error(`[Node][${requestId}]   Body:   ${errBody}`);
            throw err;
        }

        console.log(`[Node][${requestId}] ✓ STEP 3 done (${Date.now() - step3Start}ms)`);
        console.log(`[Node][${requestId}]   Image size: ${imageResponse.data.byteLength} bytes`);

        // ── Cleanup temp file ──
        await fs.promises.unlink(imagePath);

        // ── Send image to client ──
        console.log(`\n[Node][${requestId}] ✓ All steps completed! Sending PNG to client.\n`);
        res.set('Content-Type', 'image/png');
        res.set('Content-Disposition', 'attachment; filename="solved_sudoku.png"');
        res.send(imageResponse.data);

    } catch (error) {
        // Cleanup on error
        if (imagePath && fs.existsSync(imagePath)) {
            await fs.promises.unlink(imagePath).catch(() => {});
        }

        console.error(`\n[Node][${requestId}] ✗ REQUEST FAILED`);
        console.error(`[Node][${requestId}]   Error message: ${error.message}`);
        console.error(`[Node][${requestId}]   Failed URL:    ${error.config?.url || 'unknown'}`);
        if (error.code) console.error(`[Node][${requestId}]   Error code:    ${error.code}`);

        const statusCode = error.response?.status || 500;
        const detail = error.response?.data
            ? (Buffer.isBuffer(error.response.data)
                ? error.response.data.toString('utf8')
                : JSON.stringify(error.response.data))
            : error.message;

        console.error(`[Node][${requestId}]   Responding with status ${statusCode}: ${detail}\n`);

        res.status(statusCode).json({
            error: 'Sudoku solve karte waqt error aaya',
            details: detail,
            step: error.config?.url || 'unknown',
            requestId,
        });
    }
};
