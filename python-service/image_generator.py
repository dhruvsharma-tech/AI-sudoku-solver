from PIL import Image, ImageDraw, ImageFont


def generate_solution_image(grid, cell_size=50):
    """
    Solved Sudoku grid se ek clean PNG image generate karo.
    
    Args:
        grid: 9x9 list of integers (0 = empty)
        cell_size: har cell ki pixel size
    
    Returns:
        PIL Image object
    """
    size = cell_size * 9  # 450x450
    img = Image.new("RGB", (size, size), "white")
    draw = ImageDraw.Draw(img)

    # Font load karo
    try:
        font = ImageFont.truetype("arial.ttf", 30)
    except (IOError, OSError):
        try:
            # Linux/Docker fallback
            font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 30)
        except (IOError, OSError):
            font = ImageFont.load_default()

    # Grid lines draw karo
    for i in range(10):
        line_width = 3 if i % 3 == 0 else 1
        # Vertical lines
        draw.line([(i * cell_size, 0), (i * cell_size, size)],
                  fill="black", width=line_width)
        # Horizontal lines
        draw.line([(0, i * cell_size), (size, i * cell_size)],
                  fill="black", width=line_width)

    # Numbers likho
    for row in range(9):
        for col in range(9):
            digit = grid[row][col]
            if digit != 0:
                x = col * cell_size + cell_size // 3
                y = row * cell_size + cell_size // 4
                draw.text((x, y), str(digit), fill="black", font=font)

    return img
