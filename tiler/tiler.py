from PIL import Image
import os
import json
from collections import defaultdict
import sys

INPUT_IMAGES = [
    'map_lod_1.png',
    'map_lod_3.png',
    'map_lod_5.png',
    'map_lod_7.png',
    'map_lod_9.png',
]

zoom_index = 0
json_output = defaultdict(dict)

for input_image in INPUT_IMAGES:
    INPUT_IMAGE = input_image
    OUTPUT_DIR = sys.argv[1]
    TILE_SIZE = 256
    ZOOM = zoom_index
    zoom_index += 1

    if ZOOM not in json_output:
        json_output[ZOOM] = {}

    img = Image.open(INPUT_IMAGE).convert("RGBA")
    width, height = img.size

    json_output[ZOOM]["width"] = width
    json_output[ZOOM]["height"] = height

    center_x = width // 2
    center_y = height // 2

    out_dir = os.path.join(OUTPUT_DIR, str(ZOOM))
    os.makedirs(out_dir, exist_ok=True)

    # =========================
    # РАДИУС ОБХОДА (ВАЖНО)
    # =========================
    RADIUS_X = width // TILE_SIZE + 2
    RADIUS_Y = height // TILE_SIZE + 2


    # =========================
    # ОГРАНИЧЕННАЯ СПИРАЛЬ
    # =========================
    def spiral(max_radius):
        x, y = 0, 0
        yield x, y

        step = 1

        while step <= max_radius * 2:

            for _ in range(step):
                x += 1
                yield x, y

            for _ in range(step):
                y -= 1
                yield x, y

            step += 1

            for _ in range(step):
                x -= 1
                yield x, y

            for _ in range(step):
                y += 1
                yield x, y

            step += 1


    # =========================
    # TILE EXTRACT
    # =========================
    def extract_tile(px, py):
        half = TILE_SIZE // 2

        tile = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), (0, 0, 0, 0))

        for x in range(TILE_SIZE):
            for y in range(TILE_SIZE):

                src_x = px + (x - half)
                src_y = py + (y - half)

                if 0 <= src_x < width and 0 <= src_y < height:
                    tile.putpixel((x, y), img.getpixel((src_x, src_y)))

        return tile


    # =========================
    # GENERATION
    # =========================
    for dx, dy in spiral(max(RADIUS_X, RADIUS_Y)):

        # глобальный предел (защита)
        if abs(dx) > RADIUS_X or abs(dy) > RADIUS_Y:
            continue

        px = center_x + dx * TILE_SIZE
        py = center_y + dy * TILE_SIZE

        # если тайл полностью вне карты — пропускаем
        if (
            px + TILE_SIZE // 2 < 0 or
            py + TILE_SIZE // 2 < 0 or
            px - TILE_SIZE // 2 > width or
            py - TILE_SIZE // 2 > height
        ):
            continue

        tile = extract_tile(px, py)

        x_dir = os.path.join(out_dir, str(dx))
        os.makedirs(x_dir, exist_ok=True)

        path = os.path.join(x_dir, f"{dy}.webp")
        tile.save(path, 'WEBP', quality=100)

        if dx not in json_output[ZOOM]:
            json_output[ZOOM][dx] = {}

        json_output[ZOOM][dx][dy] = path.replace("\\", "/")

        print(f"tile {dx},{dy}, {path}")

with open(f"{sys.argv[1]}/tiles.json", "w", encoding="utf-8") as f:
    json.dump(json_output, f, ensure_ascii=False, indent=4)

print("DONE")
