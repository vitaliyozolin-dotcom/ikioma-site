import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../timeweb-dist/", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const assetNames = await readdir(new URL("assets/", root));
const plain = html.replace(/<!-- -->/g, "").replace(/\u00a0/g, " ");
const js = (await Promise.all(assetNames.filter(name => name.endsWith(".js")).map(name => readFile(new URL("assets/" + name, root), "utf8")))).join("\n");

test("exports commercial VELA page with canonical URL and current release marker", () => {
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<title>SIP-дом VELA от 5,2 млн ₽ \| Семейная ипотека 6% \| ИКИОМА<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/);
  assert.match(html, /data-release="vela-commercial-v2-20261007"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
});

test("renders the shortened customer journey plus commercial proof and budget builder", () => {
  const sections = [...html.matchAll(/data-section="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections, ["hero", "product", "offers", "real-budget", "budget", "mortgage", "process", "faq"]);
});

test("all internal navigation links point to existing IDs", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.has(match[1]), "Missing anchor " + match[1]);
});

test("hero immediately explains product, price, mortgage and construction regions", () => {
  for (const phrase of [
    "Одноэтажный SIP-дом для семьи",
    "Семейный дом за городом.",
    "86,2 м² внутри",
    "23,1 м²",
    "5,2 млн ₽",
    "семейная ипотека",
    "Санкт-Петербург",
    "Ленинградская область",
    "Москва",
    "Московская область",
  ]) assert.match(html, new RegExp(phrase, "i"));
});

test("states the post-1-October family-mortgage construction rule accurately", () => {
  assert.match(html, /С 1 октября 2026 года/);
  assert.match(html, /6%\*/);
  assert.match(html, /вне зависимости от количества детей и региона проживания семьи/);
  assert.match(html, /если семья соответствует условиям программы/);
  assert.match(html, /Максимальный срок субсидирования по новым договорам — до 15 лет/);
  assert.match(html, /подрядчик и расчёты через эскроу/i);
});

test("shows a real anonymized project budget without pretending it is VELA price", () => {
  for (const phrase of [
    "Реальный расчёт",
    "Настоящая смета.",
    "Реальный строящийся проект ИКИОМА",
    "96 м² дома + 24 м² террасы",
    "4 782 107 ₽",
    "не цена VELA и не оферта",
    "В исходной смете пока не оценено",
    "Вода / скважина",
    "Наружное электричество",
  ]) assert.ok(plain.includes(phrase), "Missing real-budget phrase: " + phrase);
});

test("keeps personal VELA configurator distinct from the real-project proof", () => {
  for (const phrase of [
    "Сколько будет стоить мой VELA?",
    "Участок есть",
    "Участка нет",
    "Фундамент",
    "Вода / скважина",
    "Канализация / септик",
    "Наружное электричество",
    "Получить точный расчёт",
  ]) assert.ok(html.includes(phrase), "Missing configurator phrase: " + phrase);
  assert.match(js, /budget_configurator_lead/);
});

test("shows three packages and transparent exclusions", () => {
  for (const value of ["5,2", "6,3", "7,2"]) assert.ok(html.includes(value));
  for (const packageName of ["Тёплый контур", "Контур + инженерия", "С отделкой под ключ"]) assert.ok(html.includes(packageName));
  assert.match(html, /Что считается отдельно/);
  assert.match(html, /Земля, основание, наружные сети, доставка/);
  assert.match(html, /Сначала сумма/);
  assert.match(html, /Изменения — только с вами/);
});

test("keeps customer page free from technical drawings and fake social proof", () => {
  for (const forbidden of [
    "Техническая планировка",
    "Технический проект",
    "Конструкция террасы",
    "АРО-96",
    "7 неудобных вопросов",
    "Стандарт публичного кейса",
    "kontur-plan.jpg",
    "terrace-technical",
  ]) assert.ok(!html.includes(forbidden), "Forbidden customer-facing technical content: " + forbidden);
  assert.doesNotMatch(html, /★★★★★|4[.,][0-9]\/5|сотни построенных|тысяч[аи] домов/i);
});

test("has one honest construction-visit CTA", () => {
  assert.equal((html.match(/Запросить просмотр/g) || []).length, 1);
  assert.match(html, /Проверим, какой объект сейчас можно показать/);
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
  assert.match(html, /data-goal="budget_configurator_lead"/);
});

test("exports three ad variants of the same landing", async () => {
  const variants = [
    ["na-svoem-uchastke/index.html", "VELA", "на вашем участке."],
    ["semejnaya-ipoteka/index.html", "VELA", "по семейной ипотеке."],
    ["zemlya-i-dom/index.html", "Земля + VELA", "в одной сделке."],
  ];
  for (const [path, first, second] of variants) {
    const variant = await readFile(new URL(path, root), "utf8");
    assert.ok(variant.includes(first), "Missing first hero line in " + path);
    assert.ok(variant.includes(second), "Missing second hero line in " + path);
    assert.match(variant, /robots" content="noindex, follow"/);
  }
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
