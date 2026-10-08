const express = require('express');
const cors = require('cors');
const path = require('path');
const sudokuRoutes = require('./routes/sudokuRoutes');

const app = express();

// ─── Middleware ───
app.use(cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:80', 'http://localhost:3000']
}));
app.use(express.json());

// ─── API Routes ───
app.use('/api', sudokuRoutes);

// ─── Root Health Check ───
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Node.js orchestrator running',
        services: {
            python: process.env.PYTHON_SERVICE_URL || 'http://localhost:5000',
            java: process.env.JAVA_SERVICE_URL || 'http://localhost:8080'
        }
    });
});

// ─── Start Server ───
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Node.js orchestrator running on http://localhost:${PORT}`);
    console.log(`   Python service: ${process.env.PYTHON_SERVICE_URL || 'http://localhost:5000'}`);
    console.log(`   Java service:   ${process.env.JAVA_SERVICE_URL  || 'http://localhost:8080'}`);
});
