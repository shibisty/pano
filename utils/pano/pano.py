from PIL import Image
import math
import os
import json
import sys

INPUT_DIR = sys.argv[1]
PANO_SIZES = [360, 720, 1944, 3852, 7704] #
WEBP_QUALITY = 100
LOSSLESS = False


SUPPORTED_EXTENSIONS = (
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".tif",
    ".tiff",
)

def pano_to_tiles(input_image, output_dir, pano_size):
    tile_size = pano_size/18
    img = Image.open(input_image).convert("RGB")
    width, height = img.size

    print(f"Size: {width}x{height}")

    cols = math.ceil(width / tile_size)
    rows = math.ceil(height / tile_size)

    os.makedirs(output_dir, exist_ok=True)

    for y in range(rows):
        for x in range(cols):

            left = x * tile_size
            upper = y * tile_size

            right = min(left + tile_size, width)
            lower = min(upper + tile_size, height)

            tile = img.crop((left, upper, right, lower))

            # pad edges (IMPORTANT!)
            if tile.size != (tile_size, tile_size):
                padded = Image.new("RGB", (tile_size, tile_size))
                padded.paste(tile, (0, 0))
                tile = padded

            filename = f"{x}_{y}.webp"

            tile.save(
                os.path.join(output_dir, filename),
                "WEBP",
                quality=WEBP_QUALITY,
                lossless=LOSSLESS,
                method=6
            )

            print("Saved", filename)

    return {
        "width": tile_size,
        "height": tile_size,
    }

# ==========================================
# PROCESS
# ==========================================

files = [
    f for f in os.listdir(INPUT_DIR)
    if f.lower().endswith(SUPPORTED_EXTENSIONS)
]

files.sort()

json_output = {}
json_output['max_floor'] = 0

root_dir = output_dir = os.path.join(
    INPUT_DIR,
    INPUT_DIR
)

for filename in files:
    pano_json_output = {}
    pano_json_output['pano_sizes'] = PANO_SIZES

    input_path = os.path.join(INPUT_DIR, filename)
    image_name = os.path.splitext(filename)[0]
    image_data = list(map(int, str(image_name).split("_")))

    if image_name not in pano_json_output:
        pano_json_output = {}

    if json_output['max_floor'] < image_data[1]:
        json_output['max_floor'] = image_data[1]

    print(f"\nProcessing: {filename}")

    original = Image.open(input_path).convert("RGBA")

    for pano_size in PANO_SIZES:
        if str(pano_size) not in pano_json_output:
            pano_json_output[str(pano_size)] = {}
        
        width = pano_size
        height = pano_size // 2

        print(f"  -> {width}x{height}")

        resized = original.resize((width, height), Image.LANCZOS)

        output_dir = os.path.join(
            root_dir,
            str(image_data[0]),
            str(image_data[1]),
        )

        size_dir = os.path.join(
            output_dir,
            str(width)
        )

        os.makedirs(size_dir, exist_ok=True)

        output_path = os.path.join(
            size_dir,
            "pano.webp"
        )

        resized.save(
            output_path,
            "WEBP",
            quality=WEBP_QUALITY,
            lossless=LOSSLESS,
            method=6
        )

        pano_json_output[str(pano_size)]["tiles_size"] = pano_to_tiles(output_path, os.path.join(size_dir, "tiles"), pano_size)

    with open(f"{output_dir}/tiles.json", "w", encoding="utf-8") as f:
        json.dump(pano_json_output, f, ensure_ascii=False, indent=4)
    
with open(f"{root_dir}/data.json", "w", encoding="utf-8") as f:
    json.dump(json_output, f, ensure_ascii=False, indent=4)

print("Done.")
