import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Original approved IKIOMA symbol. Only the viewport is tightened for small icons.
export async function generateIcons(outputDir) {
  const source = await readFile(new URL("../public/brand/ikioma-symbol.svg", import.meta.url), "utf8");
  const svg = source.replace('viewBox="0 0 1024 1024"', 'viewBox="176 160 672 672"');
  await writeFile(path.join(outputDir, "favicon.svg"), svg);
  for (const [name, size] of [["favicon-16.png", 16], ["favicon-32.png", 32], ["apple-touch-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
    await sharp(Buffer.from(svg)).resize(size, size).flatten({ background: "#f8f7f3" }).png().toFile(path.join(outputDir, name));
  }
  const png = await readFile(path.join(outputDir, "favicon-32.png"));
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header[6] = 32; header[7] = 32;
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  await writeFile(path.join(outputDir, "favicon.ico"), Buffer.concat([header, png]));
  await writeFile(path.join(outputDir, "site.webmanifest"), JSON.stringify({
    name: "ИКИОМА — по-настоящему свой дом", short_name: "ИКИОМА", lang: "ru",
    start_url: "/", display: "browser", background_color: "#f8f7f3", theme_color: "#202a25",
    icons: [192, 512].map(size => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png" }))
  }, null, 2));
}
