from google import genai
from google.genai import types
from PIL import Image
import os
import json
import re
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


def get_gemini_client():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable set nahi hai. Kripya .env file mein GEMINI_API_KEY daalein.")
    return genai.Client(api_key=api_key)


def extract_grid_from_image(image_path: str):
    """
    Sudoku image se 9x9 integer grid extract karo using Gemini Vision API.
    Empty cells = 0, Digits = 1 to 9.
    """
    client = get_gemini_client()
    pil_image = Image.open(image_path)

    prompt = (
        "You are an expert optical Sudoku puzzle reader and digit recognition engine.\n"
        "Carefully inspect this Sudoku puzzle image from top-left to bottom-right.\n"
        "Extract the exact 9x9 Sudoku grid shown in the image.\n\n"
        "Rules:\n"
        "1. Represent every empty / blank cell as 0.\n"
        "2. Represent each given clue digit with its exact integer value (1, 2, 3, 4, 5, 6, 7, 8, 9).\n"
        "3. The grid must contain exactly 9 rows, and each row must contain exactly 9 integer elements.\n"
        "4. Standard Sudoku rules apply: no given non-zero digit should appear twice in the same row, column, or 3x3 box.\n"
        "5. Return ONLY a valid JSON object with the key 'grid' containing the 2D array of 9x9 integers.\n"
        "Example format:\n"
        '{"grid": [[0, 5, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0, 0, 0], ...]}'
    )

    models_to_try = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"]
    last_error = None

    for model_name in models_to_try:
        try:
            print(f"[Gemini] Calling {model_name} for Sudoku grid extraction...")
            response = client.models.generate_content(
                model=model_name,
                contents=[prompt, pil_image],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )

            raw_text = response.text.strip()
            print(f"[Gemini] Response received from {model_name}:\n{raw_text[:200]}...")

            # Clean possible markdown fences
            cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
            cleaned = re.sub(r"```\s*$", "", cleaned, flags=re.MULTILINE).strip()

            data = json.loads(cleaned)
            grid = data.get("grid")

            if not grid or len(grid) != 9:
                raise ValueError(f"Grid does not have 9 rows: got {len(grid) if grid else 0}")

            for row_idx, row in enumerate(grid):
                if len(row) != 9:
                    raise ValueError(f"Row {row_idx} does not have 9 columns: got {len(row)}")
                for col_idx, val in enumerate(row):
                    if not isinstance(val, int) or val < 0 or val > 9:
                        grid[row_idx][col_idx] = int(val) if str(val).isdigit() else 0

            print("[Gemini] SUCCESS: Grid successfully parsed and validated!")
            return grid

        except Exception as e:
            print(f"[Gemini] ERROR with {model_name}: {e}")
            last_error = e

    raise last_error
