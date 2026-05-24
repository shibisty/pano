from PIL import Image
import sys
import os

SIZE_INCREMENT = 512
BASE_SIZE = 1280 - SIZE_INCREMENT

def remove_green_screen(img):

    img = img.convert("RGBA")
    pixels = img.load()

    width, height = img.size

    for y in range(height):
        for x in range(width):

            r, g, b, a = pixels[x, y]

            # chromakey detection
            if g > 120 and g > r * 1.3 and g > b * 1.3:
                pixels[x, y] = (0, 0, 0, 0)

    return img

def make_lods(input_path, output_dir, output_prefix="map"):

    img = Image.open(input_path).convert("RGBA")
    img = remove_green_screen(img)

    # =====================================================
    # SAVE ORIGINAL
    # =====================================================

    os.makedirs(output_dir, exist_ok=True)

    original = img.copy()
    original.save(f"{output_dir}/original.webp", "WEBP", quality=100)

    print("saved original.webp")

    # =====================================================
    # IMAGE SIZE
    # =====================================================

    w, h = img.size
    max_side = max(w, h)

    # =====================================================
    # LODS
    # =====================================================

    for i in [1, 3, 5, 7, 9]:

        increment = SIZE_INCREMENT * i
        target_size = BASE_SIZE + increment

        # ---------------------------------------------
        # SCALE WITHOUT DISTORTION
        # ---------------------------------------------

        scale = target_size / max_side

        new_w = int(w * scale)
        new_h = int(h * scale)

        scaled = img.resize(
            (new_w, new_h),
            Image.Resampling.LANCZOS
        )

        # =====================================================
        # CENTER ON SQUARE CANVAS
        # =====================================================

        canvas = Image.new(
            "RGBA",
            (target_size, target_size),
            (0, 0, 0, 0)
        )

        x = (target_size - new_w) // 2
        y = (target_size - new_h) // 2

        canvas.paste(scaled, (x, y), scaled)

        # =====================================================
        # SAVE
        # =====================================================

        output_path = f"{output_prefix}_lod_{i}.png"

        canvas.save(output_path, "PNG")

        print(
            f"saved {output_path} "
            f"({target_size}x{target_size}) "
            f"image={new_w}x{new_h}"
        )


if __name__ == "__main__":

    if len(sys.argv) < 3:
        print("usage: python lod.py image.png output_dir")
        sys.exit(1)

    make_lods(sys.argv[1], sys.argv[2])
