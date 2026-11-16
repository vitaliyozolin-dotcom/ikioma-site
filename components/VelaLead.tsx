"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ConsentCopy } from "./vela-legal";
import { operator } from "./vela-legal-data";
import { catalog, money, type Estimate, type MortgageResult } from "./vela-calculations";
import { CONSENT_VERSION } from "./vela-consent-version.mjs";
import { attribution, deliverVelaLead, leadKinds, normalizePhone, type LeadKind } from "./vela-leads";

export type Land = "own" | "search" | "undecided";
const lands = { own: "Есть участок", search: "Участок подбираю", undecided: "Пока не определился" };
const emptyForm = { name: "", phone: "", email: "", comment: "", consent: false, company: "", includeMortgage: false };

export default function VelaLead({ kind, close, selection, quote, land, setLand, mortgage, track }: {
  kind: LeadKind | null;
  close: () => void;
  selection: string[];
  quote: Estimate;
  land: Land;
  setLand: (value: Land) => void;
  mortgage: MortgageResult | null;
  track: (name: string, options?: Record<string, string | number>) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pending = useRef<AbortController | null>(null);
  const last = useRef<{ key: string; id: string } | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "sent">("idle");
  const [message, setMessage] = useState("");
  const [showPhone, setShowPhone] = useState(false);
  const [receipt, setReceipt] = useState("");

  useEffect(() => {
    if (kind && !dialog.current?.open) dialog.current?.showModal();
    if (!kind && dialog.current?.open) dialog.current.close();
  }, [kind]);
  useEffect(() => () => pending.current?.abort(), []);

  function dismiss() {
    if (pending.current) return;
    close();
    setShowPhone(false);
    if (status === "sent") { setStatus("idle"); setForm(emptyForm); setReceipt(""); }
    else { setStatus("idle"); setMessage(""); }
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current || !kind) return;
    const phone = normalizePhone(form.phone);
    if (!phone || !form.consent) {
      setStatus("error");
      setMessage("Проверьте номер телефона и подтвердите согласие.");
      return;
    }
    if (quote.version !== catalog.version) {
      setStatus("error"); setMessage("В расчёте сохранены прежние цены. Обновите стоимость в калькуляторе перед отправкой."); return;
    }
    const scenario = form.includeMortgage && mortgage ? {
      budget: mortgage.budget, down: mortgage.down, years: mortgage.years, rate: mortgage.rate,
    } : null;
    const body = {
      version: 2, project: catalog.project, kind, name: form.name.trim(), phone, email: form.email.trim(),
      comment: form.comment.trim(), company: form.company, land, selection: [...selection].sort(),
      catalogVersion: quote.version, mortgage: scenario, consent: { accepted: true, version: CONSENT_VERSION },
      page: window.location.pathname,
      attribution: attribution(window.location.search, document.referrer, window.location.origin),
    };
    const key = JSON.stringify(body);
    const requestId = last.current?.key === key ? last.current.id : crypto.randomUUID();
    last.current = { key, id: requestId };
    const controller = new AbortController();
    pending.current = controller;
    setStatus("sending");
    setMessage("");
    setShowPhone(false);
    try {
      setReceipt(await deliverVelaLead({ ...body, requestId }, controller.signal));
      setStatus("sent");
      last.current = null;
      track("lead_success", { kind });
    } catch (error) {
      if (controller.signal.aborted) return;
      setStatus("error");
      const reason = error instanceof Error ? error.message : "";
      if (reason === "catalog_changed") setMessage("Цены обновились. Сохраните расчёт и перезагрузите страницу, чтобы получить актуальные цены.");
      else if (reason === "rate_limit") setMessage("Слишком много попыток. Подождите минуту и отправьте заявку снова.");
      else {
        setMessage("Получение заявки не подтверждено. Попробуйте ещё раз или свяжитесь с нами по телефону.");
        setShowPhone(true);
      }
    } finally { pending.current = null; }
  }

  return <dialog ref={dialog} className="vl-dialog vl-lead-dialog" aria-labelledby="vl-lead-title" onCancel={event => { event.preventDefault(); dismiss(); }}>
    <div className="vl-dialog-heading"><h2 id="vl-lead-title">{status === "sent" ? "Заявка получена" : kind ? leadKinds[kind] : "Заявка"}</h2><button type="button" className="vl-icon-button" aria-label="Закрыть форму" onClick={dismiss} disabled={status === "sending"}>×</button></div>
    {kind && (status === "sent" ? <div className="vl-lead-confirmation" role="status">
      <p>Специалист ИКИОМА свяжется с вами по указанному номеру.</p><p>Номер заявки <strong>{receipt.slice(0, 8).toUpperCase()}</strong></p>
      <button type="button" className="vl-btn vl-btn-primary" onClick={dismiss}>Вернуться к проекту</button>
    </div> : <form onSubmit={send} className="vl-lead-form" aria-busy={status === "sending"}>
      <p>{kind === "visit" ? "Уточним, какой объект и в какой день можно посмотреть." : "Обсудим ваши пожелания и уточним данные, необходимые для расчёта."}</p>
      <div className="vl-lead-quote"><span>Выбранные позиции с ценой</span><strong>от {money(quote.total)}</strong>
        {quote.pending.length > 0 && <small>Индивидуально: {quote.pending.map(service => service.title).join(", ")}</small>}</div>
      <fieldset disabled={status === "sending"}>
        <div className="vl-form-fields">
          <label>Имя <small>по желанию</small><input type="text" name="name" autoComplete="name" maxLength={120} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label>Телефон<input type="tel" name="phone" autoComplete="tel" inputMode="tel" placeholder="+7 999 000-00-00" required maxLength={36} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Электронная почта <small>по желанию</small><input type="email" name="email" autoComplete="email" maxLength={180} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
          <label>Участок<select name="land" value={land} onChange={e => setLand(e.target.value as Land)}>{Object.entries(lands).map(([key, label]) => <option value={key} key={key}>{label}</option>)}</select></label>
        </div>
        <label>Комментарий <small>по желанию</small><textarea name="comment" maxLength={500} rows={3} placeholder="Например, район строительства и желаемая комплектация" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></label>
        <div className="vl-honey" aria-hidden="true"><label>Компания<input type="text" name="company" autoComplete="off" tabIndex={-1} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label></div>
        {mortgage && <label className="vl-check"><input type="checkbox" checked={form.includeMortgage} onChange={e => setForm({ ...form, includeMortgage: e.target.checked })} />Приложить мой ипотечный расчёт</label>}
        <label className="vl-check"><input type="checkbox" required name="consent" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /><ConsentCopy /></label>
      </fieldset>
      {message && <p className="vl-form-error" role="alert">{message}</p>}
      {showPhone && <a className="vl-contact-alt" href={"tel:" + operator.phoneHref}>{operator.phone}</a>}
      <button type="submit" className="vl-btn vl-btn-primary vl-full" disabled={status === "sending"}>{status === "sending" ? "Отправляем" : "Отправить заявку"}</button>
    </form>)}
  </dialog>;
}
