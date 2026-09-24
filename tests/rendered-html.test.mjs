import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../timeweb-dist/", import.meta.url);
const html = await readFile(new URL("index.html", root), "utf8");
const assetNames = await readdir(new URL("assets/", root));
const js = (await Promise.all(assetNames.filter(name => name.endsWith(".js")).map(name => readFile(new URL(`assets/${name}`, root), "utf8")))).join("\n");

test("exports Russian VELA page with canonical URL and release marker", () => {
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<title>ИКИОМА \| VELA — по-настоящему свой дом<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru"/);
  assert.match(html, /data-release="vela-proof-visit-20260924"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
});

test("renders exactly eight sections in the agreed purchase order", () => {
  const sections = [...html.matchAll(/data-section="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(sections, ["hero", "product", "offers", "purchase", "technology", "process", "evidence", "contact"]);
});

test("all internal navigation links point to existing IDs", () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.has(match[1]), `Missing anchor ${match[1]}`);
});

test("does not market terraces as indoor area or invent a two-bedroom drawing", () => {
  assert.match(html, /86,2/);
  assert.match(html, /23,1/);
  assert.match(html, /Схему и площади согласуем до договора/);
  assert.match(html, /Технический план VELA: три спальни/);
  assert.doesNotMatch(html, /120 м² жилой/);
  assert.doesNotMatch(html, /Дом КОНТУР|«КОНТУР»|Число 120 больше|Единственный калькулятор/);
});

test("shows all three provisional prices with nearby scope limitations", () => {
  for (const value of ["5,2", "6,3", "7,2"]) assert.ok(html.includes(value));
  assert.match(html, /Тёплый контур/);
  assert.match(html, /Контур \+ инженерия/);
  assert.match(html, /С отделкой под ключ/);
  assert.match(html, /Предварительный ориентир/);
  assert.match(html, /Земля не входит в цену/);
  assert.match(html, /Фундамент, подготовка участка, наружные сети/);
});

test("every emitted local image, stylesheet and script exists in export", async () => {
  const assets = new Set([...html.matchAll(/(?:src|href)="(\/(?:assets|images)\/[^"?#]+)"/g)].map(match => match[1]));
  assert.ok(assets.size >= 6);
  for (const path of assets) await access(new URL(`.${path}`, root));
  await access(new URL("images/kontur-family-interior-v1.webp", root));
  await access(new URL("images/kontur-covered-terrace-v1.webp", root));
});

test("client retains production lead endpoint, native dialog and timeout handling", () => {
  assert.match(js, /https:\/\/stroios-188-225-38-55\.sslip\.io\/api\/public\/leads/);
  assert.match(js, /AbortController/);
  assert.match(js, /showModal/);
  assert.match(js, /Отправить заявку/);
  assert.match(js, /Согласен на обработку/);
});

test("structured data describes VELA without provisional financial promises", () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const data = JSON.parse(match[1]);
  const product = data["@graph"].find(item => item["@type"] === "Product");
  assert.equal(product.name, "ИКИОМА | VELA");
  assert.equal(product.offers, undefined);
  assert.equal(product.aggregateRating, undefined);
});


test("renders proof-led SIP sales layer without invented testimonials", () => {
  for (const phrase of [
    "Сначала причина и новая цифра. Потом работа.",
    "Вы знаете, по какой версии строим.",
    "7 неудобных вопросов про SIP.",
    "Без доплаты задним числом.",
    "План и факт рядом.",
    "Не просим",
    "Доступно сейчас",
    "Стандарт публичного кейса ИКИОМА",
  ]) assert.ok(html.includes(phrase), "Missing proof phrase: " + phrase);
  assert.match(html, /Техническая планировка/);
  assert.match(html, /Конструкция террасы/);
  assert.match(html, /Границы комплектаций/);
  assert.doesNotMatch(html, /★★★★★|4[.,][0-9]\/5|сотни построенных|тысяч[аи] домов/i);
});

test("shows full budget logic and an honest construction-visit request", () => {
  for (const phrase of [
    "Полная логика бюджета",
    "Не прячем участок внутри цены дома.",
    "Условия участка",
    "Изменения и опции",
    "Физическая проверка",
    "Запросить просмотр",
    "Если подходящего объекта сейчас нет, так и скажем",
  ]) assert.ok(html.includes(phrase), "Missing proof/visit phrase: " + phrase);
  assert.equal((html.match(/Запросить просмотр/g) || []).length, 1);
});

test("answers seven SIP-specific objections without absolute safety claims", () => {
  for (const phrase of ["душно", "влагой и плесенью", "электрика", "пожаробезопасно", "звукоизоляцией", "переносить розетки", "мышами и насекомыми"]) assert.match(html, new RegExp(phrase, "i"));
  assert.doesNotMatch(html, /SIP не горит|SIP не гниёт|абсолютно безопас/i);
});

[executed on device: ams-1-vm-jgi3 (c3136344-c4b2-4937-9a65-0741a4988226)]