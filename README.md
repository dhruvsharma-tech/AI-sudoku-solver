# 🧩 AI Sudoku Solver (Microservices Architecture)

An end-to-end full-stack Sudoku solver that extracts puzzles from uploaded images using **Google Gemini Vision AI**, solves them using **Java Backtracking Algorithm**, renders clean solution images using **Python Pillow**, and orchestrates everything via a **Node.js Express** backend with a modern **React (Vite + TailwindCSS)** frontend.

---

## 🏗️ Architecture & Pipeline Flow

```text
 ┌────────────────┐
 │ React Frontend │ (Port 5173)
 └───────┬────────┘
         │ 1. Upload Sudoku Image
         ▼
 ┌──────────────────────┐
 │ Node.js Orchestrator │ (Port 3000)
 └───┬──────────────┬───┘
     │ 2. Image     │ 4. Solved Grid
     ▼              ▼
┌──────────────┐  ┌──────────────┐
│Python Service│  │ Java Service │
│   FastAPI    │  │ Spring Boot  │
│ (Port 5000)  │  │ (Port 8080)  │
└──────┬───────┘  └──────┬───────┘
       │ 3. 9x9 Grid     │ 5. Solved Grid
       └─────────────────┘
```

### 🔄 End-to-End Execution Flow:
1. **User uploads image** in the React frontend.
2. **Node.js** orchestrator receives the image and forwards it to the Python service (`POST /extract-grid`).
3. **Python (Gemini Vision AI)** analyzes the image, identifies numbers and blank cells, and returns a verified 9x9 integer grid.
4. **Node.js** sends the 9x9 grid to the Java service (`POST /api/sudoku/solve`).
5. **Java (Backtracking Algorithm)** solves the puzzle in milliseconds and returns the completed 9x9 grid.
6. **Node.js** sends the solved grid back to Python (`POST /generate-image`).
7. **Python (Pillow)** generates a crisp, high-resolution PNG image of the completed puzzle.
8. **Client displays** the solved Sudoku image for preview and download.

---

## 🛠️ Microservices & Tech Stack

| Service | Technology | Port | Role & Responsibility |
|---|---|---|---|
| **Frontend** | React (Vite, TailwindCSS) | `5173` | Modern, responsive user interface with drag-and-drop image upload. |
| **Orchestrator** | Node.js (Express, Axios, Multer) | `3000` | Microservices coordination, file handling, error propagation. |
| **Image & AI** | Python (FastAPI, Google GenAI SDK, Pillow) | `5000` | Optical grid extraction via Gemini Vision AI & solution image generation. |
| **Solver** | Java 17 (Spring Boot 3, Maven) | `8080` | High-performance Sudoku constraint satisfaction solver using recursive backtracking. |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+) & `npm`
- **Python** (v3.10+) & `pip`
- **Java JDK** (v17+) & `mvn`
- **Google Gemini API Key** (Free from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### Step 1: Clone & Configure Environment

```bash
git clone https://github.com/your-username/sudoku-solver.git
cd sudoku-solver
```

Configure your Gemini API key in `python-service`:
```bash
cp python-service/.env.example python-service/.env
```
Open `python-service/.env` and paste your key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

---

### Step 2: Start the Services

Open 4 separate terminal tabs:

#### 1. Python Service
```bash
cd python-service
python -m venv venv
source venv/Scripts/activate  # On Windows Git Bash (or venv\Scripts\activate on CMD)
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

#### 2. Java Service
```bash
cd java-service
mvn clean package -DskipTests
java -jar target/java-service-1.0.0.jar
```

#### 3. Node.js Service
```bash
cd node-service
npm install
npm start
```

#### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

### Step 3: Open Application

Navigate to:
```
http://localhost:5173
```
Upload any Sudoku image (printed or digital screenshot) and click **Solve**!

---

## 🐳 Docker Setup (Optional)

Run the entire microservices stack with a single command:
```bash
docker-compose up --build
```

---

## 📡 API Endpoints

### Node.js Orchestrator (`:3000`)
- `POST /api/solve-image` — Upload Sudoku image (multipart/form-data) → returns solved PNG image.
- `GET /health` — Check orchestrator health and service URLs.

### Python Image Processor (`:5000`)
- `POST /extract-grid` — Upload image → returns `{ "grid": [[...], ...] }`.
- `POST /generate-image` — Accepts solved `{ "grid": [[...], ...] }` → returns image/png stream.
- `GET /` — Health check & Gemini configuration status.

### Java Solver (`:8080`)
- `POST /api/sudoku/solve` — Accepts `{ "grid": [[...], ...] }` → returns solved grid.
- `GET /api/sudoku/health` — Java solver health status.

---

## 🔒 Security Note
- `.env` files and API keys are strictly excluded via `.gitignore`.
- Always keep your `GEMINI_API_KEY` private and never commit `.env` to GitHub.

---

## 📄 License
MIT License. Free to use and distribute.
