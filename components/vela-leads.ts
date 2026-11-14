export function normalizePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\+?[\d\s()\-]+$/.test(trimmed)) return null;
  let digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10 && !trimmed.startsWith("+")) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8") && !trimmed.startsWith("+")) digits = `7${digits.slice(1)}`;
  return /^[1-9]\d{9,14}$/.test(digits) ? `+${digits}` : null;
}

export const LEAD_ENDPOINT = "https://stroios-188-225-38-55.sslip.io/api/public/leads";

export type LeadKind = "estimate" | "mortgage" | "consultation" | "visit";
export const leadKinds: Record<LeadKind, string> = {
  estimate: "Расчёт для участка", mortgage: "Финансирование", consultation: "Консультация по ВЕЛА", visit: "Просмотр объекта ИКИОМА",
};

export function attribution(search: string, referrer: string, origin: string) {
  const params = new URLSearchParams(search);
  const utm = Object.fromEntries(["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "yclid"]
    .flatMap(key => { const value = params.get(key)?.trim().slice(0, 160); return value ? [[key, value]] : []; }));
  let referringSite = "";
  try { const url = new URL(referrer); if (url.origin !== origin && ["http:", "https:"].includes(url.protocol)) referringSite = url.hostname; } catch { /* direct visit */ }
  return { utm, channel: utm.utm_source || (utm.yclid ? "yandex_direct" : referringSite || "direct") };
}

export async function deliverVelaLead(body: { requestId: string }, signal: AbortSignal): Promise<string> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST", signal: AbortSignal.any([signal, AbortSignal.timeout(7500)]),
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), credentials: "omit",
      });
      if (response.status === 429) throw new Error("rate_limit");
      if (response.status === 409) {
        const data = await response.json().catch(() => null) as { error?: string } | null;
        throw new Error(data?.error === "catalog_changed" ? "catalog_changed" : "request_conflict");
      }
      if (response.status < 500 && !response.ok) throw new Error("lead_rejected");
      if (!response.ok) throw new Error("temporary");
      const data = await response.json() as { ok?: boolean; leadId?: string } | null;
      if (data?.ok !== true || data.leadId !== body.requestId || ![200, 201].includes(response.status)) throw new Error("unconfirmed");
      return data.leadId;
    } catch (error) {
      if (signal.aborted || attempt === 1 || error instanceof Error && ["rate_limit", "catalog_changed", "request_conflict", "lead_rejected"].includes(error.message)) throw error;
      await new Promise(resolve => setTimeout(resolve, 650));
    }
  }
  throw new Error("unconfirmed");
}
