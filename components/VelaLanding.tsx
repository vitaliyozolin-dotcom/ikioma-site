"use client";

/* eslint-disable @next/next/no-img-element -- local media are already optimized for static deployment */

import { useEffect, useState } from "react";
import { ArchitectureGallery, ConstructionPhotos, FrameIcon, GalleryDialog, VelaMedia, type GalleryState, type OpenGallery } from "./VelaGallery";
import VelaPlan from "./VelaPlan";
import VelaBuilder, { type SavedQuote } from "./VelaBuilder";
import VelaFinance from "./VelaFinance";
import VelaLead, { type Land } from "./VelaLead";
import { LegalFooter } from "./vela-legal";
import { operator } from "./vela-legal-data";
import type { LeadKind } from "./vela-leads";
import { catalog, estimate, money, selectionFor, type Estimate, type MortgageResult } from "./vela-calculations";

export type LandingScenario = "base" | "own-land" | "mortgage" | "land-home";
const variants: Record<LandingScenario, { headline: string; link: string; label: string }> = {
  base: { headline: catalog.headline, link: "#finance", label: "Рассчитать стоимость" },
  "own-land": { headline: "Дом на вашем участке", link: "#finance", label: "Рассчитать стоимость" },
  mortgage: { headline: "Дом с расчётом ипотеки", link: "#mortgage", label: "Рассчитать ипотеку" },
  "land-home": { headline: "Участок и свой дом", link: "#finance", label: "Рассчитать строительство" },
};
const nav = [["architecture", "Галерея"], ["plan", "Планировка"], ["finance", "Стоимость"], ["mortgage", "Ипотека"], ["process", "Как строим"]] as const;
const facts = [["115", "Площадь застройки", "м²"], ["81,7", "Площадь помещений", "м²"], ["22,2", "Площадь террасы", "м²"], ["3", "Спальни", ""]] as const;
const stages = [
  ["Заявка", "Уточняем, какой результат вы хотите получить."], ["Участок", "Смотрим подъезд, рельеф и коммуникации."],
  ["Смета", "Согласуем состав работ и стоимость."], ["Договор и оплата", "Фиксируем комплектацию, этапы и порядок платежей."],
  ["Производство", "Готовим домокомплект к отгрузке."], ["Доставка", "Согласуем дату, подъезд и разгрузку."],
  ["Монтаж", "Собираем домокомплект на подготовленном основании."], ["Дополнительные работы", "Выполняем работы по согласованной комплектации."],
  ["Приёмка", "Проверяем выполненные работы и подписываем документы."],
] as const;
// An anonymized estimate already published on the IKIOMA website, dated 05.10.2026.
const exampleCosts = [
  ["Дом, монтаж, окна, кровля и фасад", 3_373_107],
  ["Фундамент", 228_500],
  ["Септик", 87_500],
  ["Отделка по смете", 148_000],
  ["Логистика и подготовка участка", 295_000],
  ["Оформление, налоги и резерв", 650_000],
] as const;

const faq = [
  ["Что такое домокомплект?", "Это комплект для сборки дома ВЕЛА. Точный список деталей, материалов и документации фиксируем в спецификации к договору."],
  ["Что входит в стартовую цену?", "По стартовой цене рассчитывается домокомплект. Фундамент, монтаж, кровля, окна, фасад, доставка и другие работы можно добавить при расчёте."],
  ["Почему фундамент считают отдельно?", "Тип и объём основания зависят от грунта, рельефа участка и проекта. Стартовый ориентир доступен в калькуляторе."],
  ["Сколько стоит монтаж?", "Монтаж домокомплекта считается отдельно. Его стартовую цену можно добавить в калькуляторе, а точный состав сверить в смете."],
  ["Можно ли изменить планировку?", "ВЕЛА представлен в утверждённой планировке. Возможность изменения проёмов или перегородок можно обсудить с проектировщиком до договора."],
  ["Как рассчитывается инженерия?", "Для электрики, воды, отопления, канализации и вентиляции нужны исходные данные участка и согласованный состав оборудования."],
  ["Почему отделку рассчитывают индивидуально?", "Сумма зависит от площади работ, выбранных материалов, состояния основания и требований к отделке."],
  ["Можно ли строить на моём участке?", "Да, если условия участка допускают строительство. До сметы проверяем подъезд, рельеф, коммуникации и применимые ограничения."],
  ["Какие гарантии действуют?", "Гарантийные условия и порядок обращения указываются в договоре с учётом выбранного комплекта и состава работ."],
  ["Как устроена оплата?", "Суммы, этапы и условия платежей указываются в договоре после согласования сметы и способа финансирования."],
  ["Можно ли использовать ипотеку?", "Возможность финансирования зависит от банка, участка, договора и условий заёмщика. Для оценки платежа укажите свою ставку в калькуляторе."],
  ["Что нужно для точной сметы?", "Район или адрес участка, сведения о подъезде и коммуникациях, нужные работы и пожелания по материалам."],
] as const;

function ConstructionEstimateExample() {
  const total = exampleCosts.reduce((sum, [, amount]) => sum + amount, 0);
  return <div className="vl-archive-band" id="real-budget">
    <details className="vl-wrap vl-archive">
      <summary>Пример сметы по объекту ИКИОМА</summary>
      <div className="vl-archive-content">
        <div><h3>Смета от 5 октября 2026 года</h3><p>Другой объект ИКИОМА с домом 96 м² и террасой 24 м². Это сумма сметы по указанным позициям. Вода, наружная электрика и часть инженерии считались отдельно.</p></div>
        <dl className="vl-cost-lines">
          {exampleCosts.map(([label,amount]) => <div key={label}><dt>{label}</dt><dd>{money(amount)}</dd></div>)}
          <div><dt>Итого по смете</dt><dd>{money(total)}</dd></div>
        </dl>
      </div>
    </details>
  </div>;
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" className="vl-arrow" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{diagonal ? <path d="M5 19 19 5M9 5h10v10" /> : <path d="M3 12h16m-6-6 6 6-6 6" />}</svg>;
}

declare global {
  interface Window { ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void; __IKIOMA_YM_ID?: number }
}

function track(name: string, params?: Record<string, string | number>) {
  window.dispatchEvent(new CustomEvent("ikioma:goal", { detail: { name, params } }));
  if (window.__IKIOMA_YM_ID && typeof window.ym === "function") window.ym(window.__IKIOMA_YM_ID, "reachGoal", name, params);
}

export default function VelaLanding({ scenario = "base" }: { scenario?: LandingScenario }) {
  const variant = variants[scenario];
  const [lead, setLead] = useState<LeadKind | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [stored, setStored] = useState<Estimate | null>(null);
  const [land, setLand] = useState<Land>(scenario === "own-land" ? "own" : scenario === "land-home" ? "search" : "undecided");
  const [mortgageScenario, setMortgageScenario] = useState<MortgageResult | null>(null);
  const [catalogNotice, setCatalogNotice] = useState("");
  const [gallery, setGallery] = useState<GalleryState>(null);
  const [menu, setMenu] = useState(false);
  const cover = catalog.views.find(item => item.src === catalog.heroImage) ?? {
    src: catalog.heroImage, alt: catalog.heroAlt, caption: catalog.heroCaption, width: 940, height: 555,
  };
  const openGallery: OpenGallery = (items, index, trigger) => { track("gallery_open", { index }); setGallery({ items, index, trigger }); };
  const quote = stored ?? estimate(selection);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const params = new URLSearchParams(location.search);
      const ids = params.get("vela");
      if (ids === null) return;
      const version = params.get("cv");
      if (version && version !== catalog.version) setCatalogNotice("По ссылке открыты выбранные работы. Расчёт показан по текущим ценам.");
      setSelection(selectionFor(ids.split(",")));
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function changeSelection(value: string[]) {
    setSelection(value);
    setStored(null);
  }

  function restore(value: SavedQuote) {
    setSelection(selectionFor(value.selection));
    setStored(value.quote);
  }

  function openLead(kind: LeadKind) {
    if (kind !== "mortgage" && kind !== "estimate") setMortgageScenario(null);
    track("lead_open", { kind, scenario });
    setLead(kind);
  }

  return <div className="vl-page" data-release="vela-visuals-20261115" onClick={event => {
    if (event.target instanceof Element && event.target.closest("a[href^='tel:'], a[href^='mailto:']")) track("contact_click");
  }}>
    <a href="#main" className="vl-skip">К содержанию</a>
    <header className="vl-header" id="top" onKeyDown={event => { if (event.key === "Escape" && menu) { setMenu(false); event.currentTarget.querySelector<HTMLButtonElement>(".vl-menu-button")?.focus(); } }}>
      <div className="vl-wrap vl-header-inner">
        <a className="vl-brand" href="#top" aria-label="ИКИОМА, в начало страницы"><img src="/brand/ikioma-symbol.svg" alt="" width="29" height="31" /><span>ИКИОМА</span></a>
        <nav className="vl-nav" aria-label="Навигация по проекту">{nav.map(([id, label]) => <a href={"#" + id} key={id}>{label}</a>)}</nav>
        <button type="button" className="vl-header-cta" onClick={() => openLead("consultation")}>Обсудить проект <Arrow diagonal /></button>
        <button type="button" className="vl-menu-button" aria-expanded={menu} aria-controls="vl-mobile-nav" onClick={() => setMenu(!menu)}>{menu ? "Закрыть" : "Меню"}</button>
      </div>
      <nav className="vl-mobile-nav" id="vl-mobile-nav" aria-label="Навигация по проекту" hidden={!menu}>{[...nav, ["contacts", "Контакты"]].map(([id,label]) => <a href={"#" + id} key={id} onClick={() => setMenu(false)}>{label}<Arrow /></a>)}</nav>
    </header>
    <main id="main" tabIndex={-1}>
      <section className="vl-hero" aria-labelledby="vela-title" data-section="hero">
        <div className="vl-wrap">
          <div className="vl-hero-grid">
            <div className="vl-hero-copy">
              <p className="vl-kicker">Проект ИКИОМА</p>
              <h1 id="vela-title">ВЕЛА</h1>
              <p className="vl-hero-headline">{variant.headline}</p>
              <p className="vl-hero-intro">{catalog.intro}</p>
              <div className="vl-hero-price"><span>{catalog.base.title}</span><strong>от {money(catalog.base.price)}</strong><small>Фундамент, монтаж и дополнительные работы рассчитываются отдельно.</small></div>
              <div className="vl-actions"><a href={variant.link} className="vl-btn vl-btn-primary">{variant.label}<Arrow /></a><a href="#plan" className="vl-btn vl-btn-outline">Смотреть планировку</a></div>
            </div>
            <figure className="vl-cover">
              <a href="#architecture" aria-label="Смотреть галерею ВЕЛА">
                <VelaMedia view={cover} sizes="(max-width: 700px) 100vw, (max-width: 1440px) 62vw, 850px" priority />
                <span className="vl-enlarge" aria-hidden="true"><FrameIcon /></span>
              </a>
              <figcaption>{catalog.heroCaption}</figcaption>
            </figure>
          </div>
          <dl className="vl-facts">{facts.map(([value, label, unit]) => <div key={label}><dt>{label}</dt><dd>{value} {unit && <small>{unit}</small>}</dd></div>)}</dl>
        </div>
      </section>

      <ArchitectureGallery items={catalog.views} open={openGallery} />
      <section className="vl-wrap vl-story" id="house" aria-labelledby="vl-story-title">
        <div><h2 id="vl-story-title">Место для семьи <em>и для себя</em></h2></div>
        <div><p>В Г-образной кухне-гостиной можно разнести обеденную зону и мягкую группу. Три спальни выходят в отдельный холл. В доме один санузел и отдельное техническое помещение у прихожей.</p>
          {Object.entries(catalog.engineering).some(([,value]) => value) && <dl className="vl-cost-lines">{Object.entries({ ceilingHeight: "Высота потолков", ridgeHeight: "Высота по коньку", dimensions: "Габариты", roofType: "Кровля", technology: "Конструктив" }).flatMap(([key,label]) => catalog.engineering[key] ? [<div key={key}><dt>{label}</dt><dd>{catalog.engineering[key]}</dd></div>] : [])}</dl>}
        </div>
      </section>
      <VelaPlan />

      <section className="vl-kit-band" id="kit" aria-labelledby="vl-kit-title">
        <div className="vl-wrap vl-kit-inner">
          <div><p className="vl-kicker">Домокомплект</p><h2 id="vl-kit-title">Основа <em>вашего дома</em></h2><p>{catalog.base.description}</p>
            {catalog.specification.length > 0 && <dl className="vl-kit-spec">{catalog.specification.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.description}</dd></div>)}</dl>}
          </div>
          <div className="vl-kit-price"><span>Стартовая стоимость</span><strong>от {money(catalog.base.price)}</strong><p>Фундамент, сборку, кровлю, окна, фасад и работы по участку можно добавить в расчёт.</p><a href="#finance" className="vl-text-button">Выбрать работы <Arrow /></a></div>
        </div>
      </section>
      {catalogNotice && <p className="vl-wrap vl-notice" role="status">{catalogNotice}</p>}
      <VelaBuilder selection={selection} setSelection={changeSelection} quote={quote} restore={restore} onLead={() => { setMortgageScenario(null); openLead("estimate"); }} track={track} />

      <ConstructionEstimateExample />
      <VelaFinance quote={quote} onLead={openLead} onMortgage={setMortgageScenario} track={track} />
      <ConstructionPhotos items={catalog.photos} open={openGallery} action={<button type="button" className="vl-text-button" onClick={() => openLead("visit")}>Запросить просмотр объекта <Arrow diagonal /></button>} />
      <section className="vl-wrap vl-section" id="process" aria-labelledby="vl-process-title">
        <div className="vl-section-heading"><div><p className="vl-kicker">От заявки до приёмки</p><h2 id="vl-process-title">Как проходит <em>строительство</em></h2></div><p>Состав работ, сроки и порядок оплаты согласуем для вашего участка и фиксируем в договоре.</p></div>
        <ol className="vl-timeline">{stages.map(([title,copy]) => <li key={title}><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        <div className="vl-trust"><div><h3>Гарантии и документы</h3><p>{catalog.warranty ?? "Условия гарантии, список работ и порядок приёмки указываются в договоре. Запросите их вместе с расчётом."}</p>{catalog.promotion && <p>{catalog.promotion}</p>}</div><div><h3>Регистрация дома</h3><p>До начала работ согласуем, какие документы подготовим и в чём сможем помочь с оформлением.</p></div></div>
      </section>
      <section className="vl-faq-band" id="faq" aria-labelledby="vl-faq-title">
        <div className="vl-wrap vl-section vl-faq" id="questions">
          <div><p className="vl-kicker">Перед решением</p><h2 id="vl-faq-title">Ответы <em>на вопросы</em></h2></div>
          <div>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </div>
      </section>
      <section className="vl-contact-band" id="contacts" aria-labelledby="vl-contact-title">
        <div className="vl-wrap vl-contact-inner">
          <div><p className="vl-kicker">Обсудить ВЕЛА</p><h2 id="vl-contact-title">Рассчитаем дом <em>для вашего участка</em></h2><p>Расскажите, где планируете строить и какие работы нужны. Подготовим смету по выбранной комплектации.</p></div>
          <div><button type="button" className="vl-btn vl-btn-primary" onClick={() => { setMortgageScenario(null); openLead("estimate"); }}>Получить расчёт для моего участка <Arrow diagonal /></button><a className="vl-contact-phone" href={"tel:" + operator.phoneHref}>{operator.phone}</a></div>
        </div>
      </section>
    </main>
    <footer className="vl-footer"><div className="vl-wrap"><LegalFooter /><div className="vl-footer-tail"><a href="#top" className="vl-brand"><img src="/brand/ikioma-symbol.svg" alt="" width="23" height="24" /><span>ИКИОМА</span></a><span>Санкт-Петербург и Ленинградская область</span><a href="/contacts/">Контакты</a><a href="/calculation-terms/">Условия расчёта</a></div></div></footer>
    <GalleryDialog gallery={gallery} setGallery={setGallery} />
    <VelaLead kind={lead} close={() => setLead(null)} selection={selection} quote={quote} land={land} setLand={setLand} mortgage={mortgageScenario} track={track} />
  </div>;
}
