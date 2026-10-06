import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../timeweb-dist/", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const assetNames = await readdir(new URL("assets/", root));
const js = (await Promise.all(assetNames.filter(name => name.endsWith(".js")).map(name => readFile(new URL("assets/" + name, root), "utf8")))).join("\n");

test("exports paid-traffic VELA page with canonical URL and release marker", () => {
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<title>SIP-дом VELA от 5,2 млн ₽ \| Семейная ипотека 6% \| ИКИОМА<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/);
  assert.match(html, /data-release="vela-clean-mortgage-20261007"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
});

test("renders the shortened paid-traffic section order", () => {
  const sections = [...html.matchAll(/data-section="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections, ["hero", "product", "offers", "mortgage", "process", "faq"]);
});

test("all internal navigation links point to existing IDs", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.has(match[1]), "Missing anchor " + match[1]);
});

test("hero immediately explains product, family audience, price and mortgage", () => {
  for (const phrase of [
    "Одноэтажный SIP-дом для семьи",
    "Семейный дом за городом.",
    "86,2 м² внутри",
    "23,1 м²",
    "5,2 млн ₽",
    "семейная ипотека",
  ]) assert.match(html, new RegExp(phrase, "i"));
});

test("keeps family mortgage visible and qualified", () => {
  const occurrences = (html.match(/семейн(?:ая|ой) ипотек/gi) || []).length;
  assert.ok(occurrences >= 4, "Family mortgage should be repeated strategically");
  assert.match(html, /6%\*/);
  assert.match(html, /подрядчик и расчёты через эскроу/i);
  assert.match(html, /условиям программы/i);
  assert.match(html, /07\.10\.2026/);
  assert.match(html, /Решение о выдаче кредита и полные условия определяет банк/);
});

test("removes technical plans, drawings and engineering-proof clutter from the customer page", () => {
  for (const forbidden of [
    "Техническая планировка",
    "Технический проект",
    "Конструкция террасы",
    "АРО-96",
    "7 неудобных вопросов",
    "Стандарт публичного кейса",
    "контур-terrace-technical",
    "kontur-plan.jpg",
  ]) assert.ok(!html.includes(forbidden), "Forbidden customer-facing technical content: " + forbidden);
  assert.doesNotMatch(html, /чертеж/i);
});

test("shows three simple packages and transparent exclusions", () => {
  for (const value of ["5,2", "6,3", "7,2"]) assert.ok(html.includes(value));
  for (const packageName of ["Тёплый контур", "Контур + инженерия", "С отделкой под ключ"]) assert.ok(html.includes(packageName));
  assert.match(html, /Что считается отдельно/);
  assert.match(html, /Земля, основание, наружные сети, доставка/);
  assert.match(html, /Сначала сумма/);
  assert.match(html, /Изменения — только с вами/);
});

test("has one honest visit CTA and no invented social proof", () => {
  assert.equal((html.match(/Запросить просмотр/g) || []).length, 1);
  assert.match(html, /Проверим, какой объект сейчас можно показать/);
  assert.doesNotMatch(html, /★★★★★|4[.,][0-9]\/5|сотни построенных|тысяч[аи] домов/i);
});

test("every emitted local image, stylesheet and script exists in export", async () => {
  const assets = new Set([...html.matchAll(/(?:src|href)="(\/(?:assets|images)\/[^"?#]+)"/g)].map(match => match[1]));
  assert.ok(assets.size >= 5);
  for (const path of assets) await access(new URL("." + path, root));
  await access(new URL("images/kontur-family-exterior-v1.webp", root));
  await access(new URL("images/kontur-family-interior-v1.webp", root));
  await access(new URL("images/kontur-covered-terrace-v1.webp", root));
});

test("retains production lead receiver, UTM handoff and marketing goal hooks", () => {
  assert.match(js, /https:\/\/stroios-188-225-38-55\.sslip\.io\/api\/public\/leads/);
  assert.match(js, /AbortController/);
  assert.match(js, /showModal/);
  assert.match(js, /ikioma:goal/);
  assert.match(js, /lead_success/);
  assert.match(html, /data-goal="lead_open_hero"/);
  assert.match(html, /data-goal="mortgage_calculator_open"/);
  assert.match(html, /data-goal="visit_request"/);
});

test("structured data describes VELA without fake ratings or provisional offers", () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const data = JSON.parse(match[1]);
  const product = data["@graph"].find(item => item["@type"] === "Product");
  assert.equal(product.name, "ИКИОМА | VELA");
  assert.equal(product.offers, undefined);
  assert.equal(product.aggregateRating, undefined);
});
