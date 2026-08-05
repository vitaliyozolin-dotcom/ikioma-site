import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const htmlPath = new URL("../timeweb-dist/index.html", import.meta.url);

test("exports a deployable Timeweb page", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>ИКИОМА — по-настоящему свой дом<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/i);
  assert.match(html, /По-настоящему/);
  assert.match(html, /Получить расчёт АРО 105/);

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
