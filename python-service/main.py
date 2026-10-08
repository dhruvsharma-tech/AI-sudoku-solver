from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
from contextlib import asynccontextmanager
import shutil
import io
import os
import uuid
import traceback
import time
from dotenv import load_dotenv

from gemini_extractor import extract_grid_from_image
from image_generator import generate_solution_image

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    key = os.environ.get("GEMINI_API_KEY")
    if key and key.strip():
        print("[Startup] SUCCESS: GEMINI_API_KEY detected! Gemini Vision extraction ready.")
    else:
        print("[Startup] WARNING: GEMINI_API_KEY missing!")
        print("          Kripya python-service/.env file mein GEMINI_API_KEY daalein.")
    yield


app = FastAPI(
    title="Sudoku Image Processor",
    description="Gemini Vision API se Sudoku grid detect karo aur solved image generate karo",
    version="2.0.0",
    lifespan=lifespan
)


# ─────────────────────────────────────────────
# Request/Response Schemas
# ─────────────────────────────────────────────
class GridRequest(BaseModel):
    grid: List[List[int]]


# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────
@app.get("/")
def health_check():
    return {
        "status": "Python service running",
        "service": "image-processor-gemini-vision",
        "gemini_configured": bool(os.environ.get("GEMINI_API_KEY"))
    }


@app.post("/extract-grid")
async def extract_grid(file: UploadFile = File(...)):
    """
    Sudoku image upload karo -> Gemini Vision API se 9x9 grid return karo.
    """
    req_id = int(time.time() * 1000)
    temp_path = f"temp_{uuid.uuid4().hex}_{file.filename}"

    print(f"\n[Python][{req_id}] === /extract-grid (Gemini Vision) request ===")
    print(f"[Python][{req_id}] File: {file.filename}, content_type: {file.content_type}")

    try:
        # Step A: Image save karo
        t = time.time()
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file_size = os.path.getsize(temp_path)
        print(f"[Python][{req_id}] SUCCESS: Image saved -> {temp_path} ({file_size} bytes, {time.time()-t:.2f}s)")

        # Step B: Gemini Vision API se grid extract karo
        t = time.time()
        print(f"[Python][{req_id}] Running: Extracting Sudoku grid via Gemini Vision API...")
        grid = extract_grid_from_image(temp_path)
        print(f"[Python][{req_id}] SUCCESS: Grid extracted successfully ({time.time()-t:.2f}s)")

        for i, row in enumerate(grid):
            print(f"[Python][{req_id}]   Row {i}: {row}")

        print(f"[Python][{req_id}] SUCCESS: /extract-grid complete\n")
        return {"grid": grid}

    except Exception as e:
        print(f"[Python][{req_id}] ERROR: /extract-grid FAILED: {type(e).__name__}: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"{type(e).__name__}: {str(e)}")
    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"[Python][{req_id}] Temp file removed: {temp_path}")


@app.post("/generate-image")
async def generate_image(request: GridRequest):
    """
    Solved 9x9 grid lo -> PNG image return karo.
    """
    req_id = int(time.time() * 1000)
    print(f"\n[Python][{req_id}] === /generate-image request ===")
    print(f"[Python][{req_id}] Grid received:")
    for i, row in enumerate(request.grid):
        print(f"[Python][{req_id}]   Row {i}: {row}")

    try:
        t = time.time()
        print(f"[Python][{req_id}] Generating image...")
        img = generate_solution_image(request.grid)
        print(f"[Python][{req_id}] SUCCESS: Image generated ({time.time()-t:.2f}s), size={img.size}")

        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)
        byte_size = img_byte_arr.getbuffer().nbytes
        img_byte_arr.seek(0)

        print(f"[Python][{req_id}] SUCCESS: /generate-image complete - sending {byte_size} bytes PNG\n")
        return StreamingResponse(img_byte_arr, media_type="image/png")

    except Exception as e:
        print(f"[Python][{req_id}] ERROR: /generate-image FAILED: {type(e).__name__}: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")
