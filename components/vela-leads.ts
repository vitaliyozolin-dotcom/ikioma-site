// The public StroiOS receiver stores message up to 1,000 characters.
// Keep selections and consent before optional attribution, never after it.
export function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\+?[\d\s()\-]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10 && !trimmed.startsWith("+")) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8") && !trimmed.startsWith("+")) digits = `7${digits.slice(1)}`;
  return /^[1-9]\d{9,14}$/.test(digits) ? `+${digits}` : null;
}

export function leadMessage(input: {
  context: string; layout: string; offer: string; land: string;
  comment: string; query: string; release: string; timestamp: string;
}): string {
  const base = [
    `Модель: VELA. Планировка: ${input.layout}.`,
    `Комплектация: ${input.offer}. Участок: ${input.land}.`,
    `Согласие на обработку контактов для ответа на заявку: ${input.timestamp}. Версия формы: ${input.release}.`,
    input.context.slice(0, 200),
    input.comment.trim().slice(0, 300),
  ].filter(Boolean).join("\n");
  const params = new URLSearchParams(input.query);
  const attribution = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
    .map(key => params.get(key) ? `${key}: ${params.get(key)!.slice(0, 120)}` : "")
    .filter(Boolean).join("\n");
  const available = Math.max(0, 1000 - base.length - 1);
  return attribution && available > 0 ? `${base}\n${attribution.slice(0, available)}` : base;
}

export type LeadReceipt = { duplicate: boolean; leadId: string | null };
export function parseLeadReceipt(status: number, value: unknown): LeadReceipt {
  if (!value || typeof value !== "object") throw new Error("invalid_response");
  const data = value as Record<string, unknown>;
  if (data.ok !== true || data.error) throw new Error("lead_rejected");
  if (status === 201 && typeof data.leadId === "string" && data.leadId.length > 0) {
    return { duplicate: false, leadId: data.leadId };
  }
  if (status === 200 && data.duplicate === true) return { duplicate: true, leadId: null };
  // In particular, neither an empty 200 nor a honeypot 202 confirms insertion.
  throw new Error("invalid_response");
}
