from PIL import Image
import math
import os
import json

INPUT_IMAGE = "pano.tif"
OUTPUT_DIR = "tiles"

TILE_SIZE = 512
WEBP_QUALITY = 95
LOSSLESS = False

img = Image.open(INPUT_IMAGE).convert("RGB")
width, height = img.size

print(f"Size: {width}x{height}")

cols = math.ceil(width / TILE_SIZE)
rows = math.ceil(height / TILE_SIZE)

os.makedirs(OUTPUT_DIR, exist_ok=True)

for y in range(rows):
    for x in range(cols):

        left = x * TILE_SIZE
        upper = y * TILE_SIZE

        right = min(left + TILE_SIZE, width)
        lower = min(upper + TILE_SIZE, height)

        tile = img.crop((left, upper, right, lower))

        # pad edges (IMPORTANT!)
        if tile.size != (TILE_SIZE, TILE_SIZE):
            padded = Image.new("RGB", (TILE_SIZE, TILE_SIZE))
            padded.paste(tile, (0, 0))
            tile = padded

        filename = f"{x}_{y}.webp"

        tile.save(
            os.path.join(OUTPUT_DIR, filename),
            "WEBP",
            quality=WEBP_QUALITY,
            lossless=LOSSLESS,
            method=6
        )

        print("Saved", filename)

meta = {
    "width": width,
    "height": height,
    "tileSize": TILE_SIZE,
    "cols": cols,
    "rows": rows
}

with open(os.path.join(OUTPUT_DIR, "tiles.json"), "w") as f:
    json.dump(meta, f, indent=4)

print("Done.")