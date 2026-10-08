const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const sudokuController = require('../controllers/sudokuController');

// Multer v2 - disk storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|bmp|webp/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files allowed (jpeg, jpg, png, bmp, webp)'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

// POST /api/solve-image  →  image upload → solved image return
router.post('/solve-image', upload.single('image'), sudokuController.solveSudokuFromImage);

// Multer error handler
router.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});

module.exports = router;
