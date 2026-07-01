"""Process logo variants from the master logo asset."""

from __future__ import annotations

import base64
import math
import os
from io import BytesIO

from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(SCRIPT_DIR, "..", "public")

MASTER = os.path.join(SCRIPT_DIR, "logo-master.png")

CREAM = (248, 246, 240)
DARK_GREEN = (15, 41, 29)
GOLD = (212, 175, 55)
WHITE_BG = (255, 255, 255)


def dist(c1: tuple[int, ...], c2: tuple[int, ...]) -> float:
    return math.sqrt(sum((a - b) ** 2 for a, b in zip(c1[:3], c2[:3])))


def is_gold(r: int, g: int, b: int) -> bool:
    return dist((r, g, b), GOLD) < 55 or (g > 150 and r > 170 and b < 120)


def is_dark_green(r: int, g: int, b: int) -> bool:
    return dist((r, g, b), DARK_GREEN) < 70 or (
        g < 100 and r < 80 and b < 70
    )


def is_background(r: int, g: int, b: int) -> bool:
    return dist((r, g, b), CREAM) < 25 or dist((r, g, b), WHITE_BG) < 20


def remove_background(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (r, g, b, 0)
            elif is_background(r, g, b) is False and dist((r, g, b), CREAM) < 40:
                fade = dist((r, g, b), CREAM) / 40
                px[x, y] = (r, g, b, int(fade * 255))
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def to_light_variant(img: Image.Image) -> Image.Image:
    """Dark-green master → cream typography on transparent (for dark backgrounds)."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if is_gold(r, g, b):
                px[x, y] = (*GOLD, a)
            elif is_dark_green(r, g, b) or (r + g + b) < 280:
                px[x, y] = (*CREAM, a)
            elif is_background(r, g, b):
                px[x, y] = (r, g, b, 0)
            else:
                px[x, y] = (*CREAM, a)
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def to_dark_variant(img: Image.Image) -> Image.Image:
    """Dark-green master → dark green on transparent (for light backgrounds)."""
    transparent = remove_background(img)
    px = transparent.load()
    w, h = transparent.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if is_gold(r, g, b):
                px[x, y] = (*GOLD, a)
            elif is_dark_green(r, g, b) or (r + g + b) < 300:
                px[x, y] = (*DARK_GREEN, a)
    return transparent


def upscale_2x(img: Image.Image) -> Image.Image:
    w, h = img.size
    return img.resize((w * 2, h * 2), Image.Resampling.LANCZOS)


def save_set(img_1x: Image.Image, name: str) -> None:
    img_2x = upscale_2x(img_1x)
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    path_1x = os.path.join(PUBLIC_DIR, f"{name}.png")
    path_2x = os.path.join(PUBLIC_DIR, f"{name}@2x.png")
    path_svg = os.path.join(PUBLIC_DIR, f"{name}.svg")

    img_1x.save(path_1x, "PNG", optimize=True)
    img_2x.save(path_2x, "PNG", optimize=True)

    buf = BytesIO()
    img_2x.save(buf, "PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    w, h = img_2x.size
    svg = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 {w} {h}" width="{w}" height="{h}">
  <image width="{w}" height="{h}" xlink:href="data:image/png;base64,{b64}" />
</svg>"""
    with open(path_svg, "w", encoding="utf-8") as f:
        f.write(svg)

    print(f"{name}: 1x={img_1x.size}, 2x={img_2x.size}")


def remove_bg_color(img: Image.Image, bg: tuple[int, int, int], tolerance: float = 38) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            d = dist((r, g, b), bg)
            if d <= tolerance:
                px[x, y] = (r, g, b, 0)
            elif d <= tolerance + 18:
                fade = (d - tolerance) / 18
                px[x, y] = (r, g, b, int(fade * 255))
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def main() -> None:
    source_light = os.path.join(SCRIPT_DIR, "source-light.png")
    source_dark = os.path.join(SCRIPT_DIR, "source-dark.png")
    master = Image.open(MASTER)

    if os.path.isfile(source_dark):
        dark = remove_bg_color(Image.open(source_dark), CREAM)
    else:
        dark = to_dark_variant(master)

    if os.path.isfile(source_light):
        light = remove_bg_color(Image.open(source_light), DARK_GREEN)
    else:
        light = to_light_variant(master)

    save_set(dark, "logo-dark")
    save_set(light, "logo-light")
    print(f"Done -> {PUBLIC_DIR}")


if __name__ == "__main__":
    main()
