import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const htmlPath = new URL("../timeweb-dist/index.html", import.meta.url);

test("exports a deployable Timeweb page", async () => {
  const html = await readFile(htmlPath, "utf8");

  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>Дом КОНТУР от ИКИОМА — по-настоящему свой дом<\/title>/i);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/i);
  assert.match(html, /По-настоящему/);
  assert.match(html, /Дом КОНТУР/);
  assert.match(html, /86,2 м²/);
  assert.match(html, /Стоимость участка в цену не входит/);
  assert.match(html, /10 августа — 10 сентября 2026/);
  const assetNames = await readdir(new URL("../timeweb-dist/assets/", import.meta.url));
  const clientCode = (await Promise.all(assetNames.filter((name) => name.endsWith(".js")).map((name) => readFile(new URL(`../timeweb-dist/assets/${name}`, import.meta.url), "utf8")))).join("\n");
  assert.match(clientCode, /https:\/\/ikioma-telegram-gateway\.ozolin\.chatgpt\.site\/api\/public\/leads/);

  const assetPaths = [
    "/images/kontur-family-exterior-v1.webp",
    "/images/kontur-covered-terrace-v1.webp",
    "/images/kontur-family-interior-v1.webp",
    "/images/kontur-plan.jpg",
    "/images/stage-request.webp",
  ];

  for (const assetPath of assetPaths) {
    assert.match(html, new RegExp(assetPath.replaceAll("/", "\\/")));
    await access(new URL(`../timeweb-dist${assetPath}`, import.meta.url));
  }

  await access(new URL("../timeweb-dist/images/kontur-terrace-technical.jpg", import.meta.url));
  await access(new URL("../timeweb-dist/images/og-kontur-v1.jpg", import.meta.url));
});
