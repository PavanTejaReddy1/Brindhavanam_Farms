import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const SOURCES = {
  light: {
    input: path.join(__dirname, "source-light.png"),
    bg: [15, 41, 29],
    name: "logo-light",
  },
  dark: {
    input: path.join(__dirname, "source-dark.png"),
    bg: [248, 246, 240],
    name: "logo-dark",
  },
};

function removeBackground(buffer, bgRgb, tolerance = 42) {
  const { data, info } = buffer;
  const [bgR, bgG, bgB] = bgRgb;
  const out = Buffer.from(data);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const dist = Math.sqrt(
      (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2
    );

    if (dist <= tolerance) {
      out[i + 3] = 0;
    } else if (dist <= tolerance + 18) {
      const fade = (dist - tolerance) / 18;
      out[i + 3] = Math.round(fade * 255);
    }
  }

  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });
}

async function processVariant({ input, bg, name }) {
  const raw = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const trimmed = await removeBackground(raw, bg)
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9, quality: 100 })
    .toBuffer({ resolveWithObject: true });

  const { width, height } = trimmed.info;

  const png1x = await sharp(trimmed.data)
    .resize(Math.round(width / 2), Math.round(height / 2), {
      kernel: sharp.kernel.lanczos3,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const png2x = trimmed.data;

  fs.writeFileSync(path.join(publicDir, `${name}.png`), png1x);
  fs.writeFileSync(path.join(publicDir, `${name}@2x.png`), png2x);

  const base64 = png2x.toString("base64");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 ${Math.round(width / 2)} ${Math.round(height / 2)}"
  width="${Math.round(width / 2)}" height="${Math.round(height / 2)}">
  <image width="${Math.round(width / 2)}" height="${Math.round(height / 2)}"
    xlink:href="data:image/png;base64,${base64}" />
</svg>`;

  fs.writeFileSync(path.join(publicDir, `${name}.svg`), svg);

  console.log(
    `${name}: ${Math.round(width / 2)}×${Math.round(height / 2)} (1x), @2x exported`
  );
}

fs.mkdirSync(publicDir, { recursive: true });

for (const variant of Object.values(SOURCES)) {
  if (!fs.existsSync(variant.input)) {
    console.error(`Missing source: ${variant.input}`);
    process.exit(1);
  }
  await processVariant(variant);
}

console.log("Logo assets exported to frontend/public/");
