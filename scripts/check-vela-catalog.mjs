import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../public/", import.meta.url);
const data = JSON.parse(await readFile(new URL("vela/catalog.json", root), "utf8"));
const day = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Moscow" }).format(new Date());
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value).toISOString().slice(0, 10) === value;
const price = value => Number.isSafeInteger(value) && value > 0 && value <= 100_000_000;
const filled = value => typeof value === "string" && value.trim().length > 0;
const images = [...data.photos, ...data.views];
const photoPaths = [data.heroImage, ...images.flatMap(image => [image.src, image.small].filter(Boolean))];

assert.equal(data.project, "ВЕЛА");
assert.match(data.version, /^\d{4}-\d{2}-\d{2}\.\d{1,5}$/);
assert.ok(date(data.validFrom) && data.validFrom <= day && data.published, "Catalog must be approved and effective");
assert.ok(price(data.base.price) && data.base.id === "kit", "Invalid base price");
assert.ok([data.headline, data.intro, data.heroAlt, data.heroCaption, data.base.title, data.base.description].every(filled));
for (const path of photoPaths) {
  assert.match(path, /^\/vela\/[a-zA-Z0-9_-]+\.(svg|webp|png|jpe?g|avif)$/);
  await access(new URL(path.slice(1), root));
}
assert.ok(images.every(image => filled(image.alt) && filled(image.caption)), "Images need description and caption");
assert.ok(data.views.every(view => filled(view.label) && filled(view.note) && view.width > 0 && view.height > 0), "Project views need labels and sizes");
const services = data.groups.flatMap(group => group.services);
assert.ok(services.length > 0 && services.length <= 50);
const ids = new Set([data.base.id]);
for (const row of services) {
  assert.match(row.id, /^[a-z][a-z0-9-]{1,39}$/);
  assert.ok(!ids.has(row.id), "Duplicate service " + row.id);
  ids.add(row.id);
  assert.ok(filled(row.title) && filled(row.description) && (row.price === null || price(row.price)));
}
assert.ok(data.specification.every(item => filled(item.title) && filled(item.description)));
const { minYears, maxYears, maxRate, source } = data.mortgage;
assert.ok(Number.isInteger(minYears) && Number.isInteger(maxYears) && minYears >= 1 && maxYears <= 50 && minYears <= maxYears);
assert.ok(Number.isFinite(maxRate) && maxRate > 0 && maxRate <= 100);
if (source) assert.equal(new URL(source).protocol, "https:");
console.log("ВЕЛА: каталог " + data.version + " проверен.");
