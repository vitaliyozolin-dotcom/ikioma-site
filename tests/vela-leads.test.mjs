import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePhone, leadMessage, parseLeadReceipt } from '../components/vela-leads.ts';

test('phone normalization matches receiver minimum and rejects malformed values', () => {
  assert.equal(normalizePhone('8 (999) 123-45-67'), '+79991234567');
  assert.equal(normalizePhone('9991234567'), '+79991234567');
  assert.equal(normalizePhone('+70000000024'), '+70000000024');
  assert.equal(normalizePhone('+84912345678'), '+84912345678');
  assert.equal(normalizePhone('+84000000000'), '+84000000000');
  for (const value of ['12345678', 'letters', '000000000000', '123+45678901', '++79991234567']) assert.equal(normalizePhone(value), null);
});

test('only a real insertion receipt or explicit duplicate is accepted', () => {
  assert.deepEqual(parseLeadReceipt(201, { ok: true, leadId: 'test-id' }), { duplicate: false, leadId: 'test-id' });
  assert.deepEqual(parseLeadReceipt(200, { ok: true, duplicate: true }), { duplicate: true, leadId: null });
  for (const [status, body] of [[200, {}], [200, { ok: true }], [202, { ok: true }], [201, { ok: true }], [201, { ok: false, leadId: 'x' }], [201, null]]) assert.throws(() => parseLeadReceipt(status, body));
});

test('maximum form payload preserves all user details and consent before attribution', () => {
  const query = new URLSearchParams(Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(key => [key, 'x'.repeat(300)]))).toString();
  const message = leadMessage({ context: 'C'.repeat(200), layout: '2 спальни — требуется согласование проекта', offer: 'С отделкой под ключ', land: 'Нужна помощь с участком', comment: 'Т'.repeat(300), query, release: 'vela-structure-20260924', timestamp: '2026-09-24T12:00:00.000Z' });
  assert.ok(message.length <= 1000, `message length ${message.length}`);
  assert.ok(message.includes('Т'.repeat(300)));
  assert.ok(message.includes('C'.repeat(200)));
  assert.match(message, /Согласие на обработку контактов/);
  assert.match(message, /2 спальни — требуется согласование проекта/);
  assert.match(message, /Нужна помощь с участком/);
  assert.ok(message.indexOf('Согласие') < message.indexOf('utm_source'));
});
