import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../timeweb-dist/", import.meta.url);
const load = path => readFile(new URL(path, root), "utf8");
const html = await load("index.html");
const compact = value => value.replace(/<!-- -->/g, "").replace(/[\u00a0\u202f]/g, " ");
const plain = compact(html);
const assets = await readdir(new URL("assets/", root));
const catalog = JSON.parse(await load("vela/catalog.json"));

test("renders the single verified project with a price for its house kit", () => {
  assert.match(html, /<html lang="ru">/);
  assert.match(plain, /<title>Домокомплект ВЕЛА от 1 725 000 ₽ \| ИКИОМА<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/ikioma\.ru\/?"/);
  assert.match(html, /data-release="vela-family-20261124"/);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  for (const phrase of ["ВЕЛА", "115", "81,7", "22,2", "Спальни", "Ленинградская область"]) assert.ok(plain.includes(phrase), phrase);
  assert.doesNotMatch(plain, /5,2 млн|6,3 млн|7,2 млн|86,2 м²|23,1 м²|6 000 000|8 000 000|10 000 000|ипотека 6%/i);
});

test("all page anchors and local assets resolve", async () => {
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.has(match[1]), "Missing anchor " + match[1]);
  for (const id of ["house", "plan", "finance", "calculator-home", "mortgage", "expenses", "process", "architecture", "construction", "questions", "faq", "contacts"]) assert.ok(ids.has(id));
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|images|brand|vela)\/[^"?#]+)"/g)) await access(new URL("." + match[1], root));
  for (const view of catalog.views) {
    await access(new URL("." + view.src, root));
    await access(new URL("." + view.small, root));
  }
  for (const photo of catalog.photos) {
    await access(new URL("." + photo.src, root));
    if (photo.small) await access(new URL("." + photo.small, root));
  }
  assert.match(plain, /Визуализация ВЕЛА/);
  assert.ok(catalog.views.some(view => view.src === catalog.heroImage));
  assert.match(plain, /Фотографии объекта ИКИОМА на разных этапах/);
  for (const file of ["404.html", "robots.txt", "sitemap.xml", "favicon.ico", "favicon-32.png", "apple-touch-icon.png", "site.webmanifest", "vela/plan.pdf", "vela/og.jpg"]) await access(new URL(file, root));
});

test("shows four selected design views, a clear plan and household expense choices", () => {
  const architecture = plain.match(/<section[^>]*id="architecture"[\s\S]*?<\/section>/)?.[0];
  assert.ok(architecture);
  const captions = ["Терраса", "Кухня-гостиная", "Спальня", "Санузел"];
  assert.equal((architecture.match(/class="vl-view-tab"/g) || []).length, captions.length);
  for (const label of captions) assert.ok(architecture.includes(label), label);
  assert.doesNotMatch(architecture, /graphite-facade|painted-rear|entry-timber/);
  assert.doesNotMatch(plain, /Пример сметы по объекту ИКИОМА|4 782 107/);
  assert.doesNotMatch(plain, /С мебелью|class="vl-furniture"/);
  assert.match(plain, /href="\/vela\/plan\.pdf"/);
  const expenses = plain.match(/<section[^>]*id="expenses"[\s\S]*?<\/section>/)?.[0];
  assert.ok(expenses);
  assert.match(expenses, /id="vl-residents"/);
  assert.match(expenses, /id="vl-residence"/);
  assert.doesNotMatch(plain, /class="vl-finance-summary"/);
  assert.match(plain, /id="vl-rate"[^>]*value="6"/);
  const construction = plain.match(/<section[^>]*id="construction"[\s\S]*?<\/section>/)?.[0];
  assert.ok(construction);
  assert.equal((construction.match(/class="vl-image-trigger"/g) || []).length, 6);
});

test("preserves advertising routes and legal links", async () => {
  for (const [path, title] of [["na-svoem-uchastke", "Дом на вашем участке"], ["semejnaya-ipoteka", "Дом с расчётом ипотеки"], ["zemlya-i-dom", "Участок и свой дом"]]) {
    const variant = await load(path + "/index.html");
    assert.ok(compact(variant).includes(title));
    assert.match(variant, /robots" content="noindex, follow"/);
  }
  for (const path of ["privacy", "consent", "requisites", "contacts", "calculation-terms"]) {
    assert.ok(html.includes('href="/' + path + '/"'));
    assert.match(await load(path + "/index.html"), /7838103085|ИКИОМА/);
  }
  for (const file of ["m/vela/index.html", "m/vela/preview.html"]) assert.match(await load(file), /location\.search\s*\+\s*location\.hash/);
});

test("structured data and calculator are drawn from the same current catalog", () => {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match);
  const product = JSON.parse(match[1])["@graph"].find(item => item["@type"] === "Product");
  assert.equal(product.name, "Домокомплект ВЕЛА");
  assert.equal(product.additionalProperty.find(item => item.name.startsWith("Стартовая цена")).value, catalog.base.price);
  assert.equal(product.offers, undefined);
  assert.equal(product.aggregateRating, undefined);
  const rows = catalog.groups.flatMap(group => group.services);
  assert.deepEqual(rows.filter(row => row.price !== null).map(row => row.price), [228000, 450000, 490000, 528000, 538000]);
  assert.equal(catalog.base.price + rows.reduce((sum, row) => sum + (row.price ?? 0), 0), 3959000);
  assert.ok(rows.some(row => row.id === "well" && row.price === null));
});

test("marketing and the v2 receipt are wired to the existing lead receiver", async () => {
  const js = (await Promise.all(assets.filter(name => name.endsWith(".js")).map(name => load("assets/" + name)))).join("\n");
  for (const name of ["ikioma:goal", "lead_success", "service_select", "quote_pdf", "mortgage_calculator_open", "contact_click", "catalog_changed"]) assert.ok(js.includes(name), name);
  assert.match(js, /https:\/\/stroios-188-225-38-55\.sslip\.io\/api\/public\/leads/);
});
