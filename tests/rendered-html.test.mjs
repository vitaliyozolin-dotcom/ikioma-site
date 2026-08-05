import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const htmlPath = new URL("../timeweb-dist/index.html", import.meta.url);

test("exports a deployable Timeweb page", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>ИКИОМА — по-настоящему свой дом<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/i);
  assert.match(html, /По-настоящему/);
  assert.match(html, /Получить предложение АРО 120/);
  assert.match(html, /96 м² дома и 24 м² крытой террасы/);
  const assetNames = await readdir(new URL("../timeweb-dist/assets/", import.meta.url));
  const clientCode = (await Promise.all(assetNames.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../timeweb-dist/assets/${name}`, import.meta.url), "utf8")))).join("\n");
  assert.match(clientCode, /https:\/\/stroios\.online\/api\/public\/leads/);

  const assetPaths = [
    "/images/hero.webp",
    "/images/option-layout.webp",
    "/images/stage-request.webp",
  ];

  for (const assetPath of assetPaths) {
    assert.match(html, new RegExp(assetPath.replaceAll("/", "\\/")));
    await access(new URL(`../timeweb-dist${assetPath}`, import.meta.url));
  }
});
