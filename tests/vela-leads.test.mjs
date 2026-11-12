import assert from "node:assert/strict";
import test from "node:test";
import { attribution, deliverVelaLead, normalizePhone } from "../components/vela-leads.ts";

test("phone normalization accepts international and Russian local formats", () => {
  assert.equal(normalizePhone("8 (999) 123-45-67"), "+79991234567");
  assert.equal(normalizePhone("9991234567"), "+79991234567");
  assert.equal(normalizePhone("+84912345678"), "+84912345678");
  for (const value of ["12345678", "letters", "000000000000", "123+45678901", "++79991234567"]) assert.equal(normalizePhone(value), null);
});

test("attribution keeps campaign labels and uses only the referring hostname", () => {
  assert.deepEqual(attribution("?utm_source=direct_ads&utm_campaign=vela&private=ignored", "https://example.com/private?email=x", "https://ikioma.ru"), {
    utm: { utm_source: "direct_ads", utm_campaign: "vela" }, channel: "direct_ads",
  });
  assert.equal(attribution("", "https://example.com/private?email=x", "https://ikioma.ru").channel, "example.com");
  assert.equal(attribution("", "https://ikioma.ru/private", "https://ikioma.ru").channel, "direct");
});

test("accepted retries require the confirmed lead ID", async context => {
  const original = globalThis.fetch;
  context.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({ ok: true, duplicate: true, leadId: "existing-id" }, { status: 200 });
  assert.equal(await deliverVelaLead({}, new AbortController().signal), "existing-id");
  globalThis.fetch = async () => Response.json({ ok: false, error: "catalog_changed" }, { status: 409 });
  await assert.rejects(deliverVelaLead({}, new AbortController().signal), { message: "catalog_changed" });
});
