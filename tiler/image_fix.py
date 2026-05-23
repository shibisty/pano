from PIL import Image
import sys

SIZE_INCREMENT = 512
BASE_SIZE = 1280 - SIZE_INCREMENT

def make_lods(input_path, output_prefix="map"):

    img = Image.open(input_path).convert("RGBA")

    # =====================================================
    # SAVE ORIGINAL FIRST (IMPORTANT)
    # =====================================================

    original = img.copy()
    original.save(f"{sys.argv[2]}/original.webp", "WEBP", quality=100)
    print("saved original.webp")

    # =====================================================
    # SIZE INFO
    # =====================================================

    w, h = img.size
    max_side = max(w, h)

    base_scale = BASE_SIZE / max_side

    # =====================================================
    # LODS GENERATION
    # =====================================================

    for i in [1, 3, 5, 7, 9]:

        increment = SIZE_INCREMENT * i
        target_size = BASE_SIZE + increment

        new_w = int(w * base_scale + increment)
        new_h = int(h * base_scale + increment)

        scaled = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

        canvas = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))

        x = (target_size - new_w) // 2
        y = (target_size - new_h) // 2

        canvas.paste(scaled, (x, y), scaled)

        # =====================================================
        # SAVE AS PNG
        # =====================================================

        output_path = f"{output_prefix}_lod_{i}.png"
        canvas.save(output_path, "PNG", quality=100)

        print(f"saved {output_path} ({target_size}x{target_size})")


if __name__ == "__main__":
    make_lods(sys.argv[1])