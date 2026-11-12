"use client";

import { useEffect, useRef, useState } from "react";
import { catalog, money, selectionFor, type Estimate } from "./vela-calculations";

export type SavedQuote = { savedAt: string; selection: string[]; quote: Estimate };
const STORAGE_KEY = "ikioma:vela:quotes:v1";

function readHistory(): SavedQuote[] {
  try {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(list)) return [];
    return list.filter(item => item && typeof item.savedAt === "string" && Array.isArray(item.selection)
      && typeof item.quote?.version === "string" && Number.isSafeInteger(item.quote.total)
      && Array.isArray(item.quote.known) && Array.isArray(item.quote.pending) && Array.isArray(item.quote.omitted)).slice(0, 5);
  } catch { return []; }
}

export default function VelaBuilder({ selection, setSelection, quote, restore, onLead, track }: {
  selection: string[];
  setSelection: (value: string[]) => void;
  quote: Estimate;
  restore: (value: SavedQuote) => void;
  onLead: () => void;
  track: (name: string, options?: Record<string, string | number>) => void;
}) {
  const [history, setHistory] = useState<SavedQuote[]>([]);
  const [status, setStatus] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [printing, setPrinting] = useState(false);
  const [inView, setInView] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  const summary = useRef<HTMLElement>(null);
  const engaged = useRef(false);

  useEffect(() => {
    const sectionNode = section.current;
    const summaryNode = summary.current;
    if (!sectionNode || !summaryNode) return;
    const sectionObserver = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    const summaryObserver = new IntersectionObserver(([entry]) => setSummaryVisible(entry.isIntersecting));
    sectionObserver.observe(sectionNode);
    summaryObserver.observe(summaryNode);
    return () => { sectionObserver.disconnect(); summaryObserver.disconnect(); };
  }, []);

  function toggle(id: string) {
    if (!engaged.current) { track("calculator_start"); engaged.current = true; }
    const selected = selection.includes(id);
    track("service_select", { service: id, selected: selected ? 0 : 1 });
    setSelection(selected ? selection.filter(item => item !== id) : [...selection, id]);
    setStatus("");
    setShareLink("");
  }

  function save() {
    const previous = readHistory();
    const entry = { savedAt: new Date().toISOString(), selection: [...selection], quote };
    const next = [entry, ...previous.filter(item => item.quote.version !== quote.version || item.selection.slice().sort().join() !== selection.slice().sort().join())].slice(0, 5);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setHistory(next);
      setStatus("Расчёт сохранён в этом браузере.");
      track("calculator_complete", { selected: selection.length });
    } catch { setStatus("Браузер не разрешил сохранить расчёт. Можно скачать его в PDF."); }
  }

  async function share() {
    const url = new URL("/", location.origin);
    url.hash = "finance";
    url.searchParams.set("vela", selectionFor(selection).join(","));
    url.searchParams.set("cv", quote.version);
    setShareLink(url.href);
    try { await navigator.clipboard.writeText(url.href); setStatus("Ссылка скопирована."); }
    catch { setStatus("Скопируйте ссылку из поля ниже."); }
  }

  async function pdf() {
    setPrinting(true);
    try {
      const { downloadQuote } = await import("./vela-quote-pdf");
      await downloadQuote(quote);
      track("quote_pdf", { selected: selection.length });
      setStatus("Расчёт выгружен в PDF.");
    } catch { setStatus("PDF не удалось скачать. Попробуйте ещё раз."); }
    finally { setPrinting(false); }
  }

  const historic = quote.version !== catalog.version;

  return <section className="vl-builder" id="finance" ref={section} aria-labelledby="vl-builder-title">
    <div className="vl-wrap vl-section">
      <span id="calculator-home" className="vl-anchor" aria-hidden="true" />
      <div className="vl-section-heading"><div><p className="vl-kicker">Стоимость строительства</p><h2 id="vl-builder-title">Соберите <em>свою комплектацию</em></h2></div>
        <p>Домокомплект — основа расчёта. Добавьте нужные работы, чтобы увидеть сумму по опубликованным ценам и список того, что предстоит уточнить.</p></div>
      {historic && <div className="vl-notice" role="status">Показан расчёт по ценам от {quote.validFrom.split("-").reverse().join(".")}. <button type="button" onClick={() => setSelection(selection)}>Пересчитать по текущим ценам</button></div>}
      <div className="vl-builder-grid">
        <div className="vl-options">
          <div className="vl-option-base"><div><p>Основа комплектации</p><strong>{catalog.base.title}</strong></div><b>от {money(historic ? quote.known[0].price : catalog.base.price)}</b></div>
          {catalog.groups.map((group, index) => <details className="vl-option-group" open={index < 2} key={group.id}>
            <summary><div><strong>{group.title}</strong><span>{group.description}</span></div><span className="vl-group-count">{group.services.filter(item => selection.includes(item.id)).length || ""}</span></summary>
            <div className="vl-service-list">{group.services.map(service => {
              const displayed = historic ? [...quote.known, ...quote.pending].find(row => row.id === service.id) ?? service : service;
              return <div className="vl-service" key={service.id}>
              <label><input type="checkbox" checked={selection.includes(service.id)} onChange={() => toggle(service.id)} /><span>{service.title}</span></label>
              <span className="vl-service-price">{displayed.price === null ? "Индивидуальный расчёт" : "от " + money(displayed.price)}</span>
              <details><summary>Как рассчитывается</summary><p>{service.description}</p></details>
            </div>; })}</div>
          </details>)}
        </div>
        <aside className="vl-quote" ref={summary} id="vela-quote" aria-labelledby="vl-quote-title">
          <p id="vl-quote-title" className="vl-kicker">Ваш расчёт</p>
          <div aria-live="polite" aria-atomic="true"><span className="vl-quote-prefix">от</span><strong className="vl-quote-total">{money(quote.total)}</strong><p className="vl-quote-caption">По выбранным позициям с ценой</p></div>
          <ul className="vl-quote-lines">{quote.known.map(row => <li key={row.id}><span>{row.title}</span><b>{money(row.price)}</b></li>)}</ul>
          {quote.pending.length > 0 && <details open className="vl-quote-details"><summary>Индивидуальный расчёт <span>{quote.pending.length}</span></summary><ul>{quote.pending.map(item => <li key={item.id}>{item.title}</li>)}</ul></details>}
          {quote.omitted.length > 0 && <details className="vl-quote-details"><summary>Работы, которые не выбраны <span>{quote.omitted.length}</span></summary><ul>{quote.omitted.map(item => <li key={item.id}>{item.title}</li>)}</ul></details>}
          <button type="button" className="vl-btn vl-btn-primary vl-full" onClick={() => { track("budget_configurator_lead"); onLead(); }}>Получить подробную смету <span aria-hidden="true">↗</span></button>
          <div className="vl-quote-tools">
            <button type="button" onClick={save}>Сохранить</button><button type="button" disabled={printing} onClick={pdf}>{printing ? "Готовим PDF" : "Скачать PDF"}</button><button type="button" onClick={share}>Поделиться</button>
          </div>
          <div className="vl-quote-history"><button type="button" onClick={() => { const saved = readHistory(); setHistory(saved); if (!saved.length) setStatus("Здесь появятся сохранённые расчёты."); }}>Мои расчёты</button>
            {history.length > 0 && <ul>{history.map(item => <li key={item.savedAt}><button type="button" onClick={() => { restore(item); setStatus("Открыт сохранённый расчёт."); setShareLink(""); }}>{new Intl.DateTimeFormat("ru-RU", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Moscow" }).format(new Date(item.savedAt))} · {money(item.quote.total)}</button></li>)}</ul>}
          </div>
          {shareLink && <input type="url" aria-label="Ссылка на расчёт" readOnly value={shareLink} onFocus={event => event.target.select()} />}
          {status && <p className="vl-quote-status" role="status">{status}</p>}
        </aside>
      </div>
    </div>
    {inView && !summaryVisible && <div className="vl-mobile-quote"><span><small>По выбранным позициям</small><b>от {money(quote.total)}</b></span><a className="vl-btn vl-btn-primary" href="#vela-quote">Открыть расчёт</a></div>}
  </section>;
}
