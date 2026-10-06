"use client";

/* eslint-disable @next/next/no-img-element -- local product imagery is optimized WebP */

import { useEffect, useRef, useState, type FormEvent } from "react";
import { normalizePhone, leadMessage, parseLeadReceipt, type LeadReceipt } from "./vela-leads";

const LEAD_ENDPOINT = "https://stroios-188-225-38-55.sslip.io/api/public/leads";
const RELEASE = "vela-commercial-v2-20261007";
const MORTGAGE_DATE = "07.10.2026";

const nav = [
  ["house", "Дом"],
  ["finance", "Комплектации"],
  ["mortgage", "Семейная ипотека"],
  ["process", "Как строим"],
  ["contacts", "Контакты"],
] as const;

export type LandingScenario = "base" | "own-land" | "mortgage" | "land-home";

const scenarioCopy: Record<LandingScenario, { eyebrow: string; first: string; second: string; text: string; cta: string }> = {
  base: {
    eyebrow: "Одноэтажный SIP-дом для семьи",
    first: "VELA.",
    second: "Семейный дом за городом.",
    text: "86,2 м² внутри + 23,1 м² крытая терраса. Три спальни, два санузла и большая кухня-гостиная.",
    cta: "Рассчитать VELA",
  },
  "own-land": {
    eyebrow: "SIP-дом на вашем участке",
    first: "VELA",
    second: "на вашем участке.",
    text: "Проверим участок, посчитаем основание и коммуникации и соберём один понятный бюджет строительства.",
    cta: "Рассчитать на участке",
  },
  mortgage: {
    eyebrow: "Строительство дома · семейная ипотека 6%*",
    first: "VELA",
    second: "по семейной ипотеке.",
    text: "Одноэтажный SIP-дом для семьи. Посчитаем полный бюджет, первоначальный взнос и ориентировочный платёж.",
    cta: "Рассчитать по ипотеке",
  },
  "land-home": {
    eyebrow: "Земля + строительство дома",
    first: "Земля + VELA",
    second: "в одной сделке.",
    text: "Поможем определить требования к участку, проверить землю и собрать бюджет дома вместе с подготовкой к строительству.",
    cta: "Рассчитать землю + дом",
  },
};

const realProjectBudget = {
  total: 4_782_107,
  mortgagePayment: 32_283,
  date: "05.10.2026",
  label: "Реальный строящийся проект ИКИОМА · обезличено",
  scope: "96 м² дома + 24 м² террасы",
  items: [
    ["Дом, монтаж, окна, кровля и фасад", 3_373_107],
    ["Фундамент", 228_500],
    ["Септик", 87_500],
    ["Отделка в смете проекта", 148_000],
    ["Логистика и подготовка участка", 295_000],
    ["Оформление, налоги и резерв", 650_000],
  ] as const,
};

const optionPrices = {
  foundation: 228_500,
  sewer: 87_500,
} as const;

const gallery = [
  {
    src: "/images/kontur-family-exterior-v1.webp",
    label: "Снаружи",
    title: "Спокойная архитектура.",
    text: "Один этаж, большие окна и крытая терраса под общей кровлей.",
    alt: "Визуализация одноэтажного дома VELA с крытой террасой",
  },
  {
    src: "/images/kontur-family-interior-v1.webp",
    label: "Внутри",
    title: "Кухня-гостиная для всей семьи.",
    text: "27,3 м² общей зоны — для большого стола, вечеров вместе и прямого выхода на террасу.",
    alt: "Визуализация кухни-гостиной дома VELA",
  },
  {
    src: "/images/kontur-covered-terrace-v1.webp",
    label: "Терраса",
    title: "23,1 м² под крышей.",
    text: "Завтрак летом, ужин вечером и дополнительное пространство без второго этажа.",
    alt: "Визуализация крытой террасы дома VELA",
  },
] as const;

const offers = [
  {
    name: "Тёплый контур",
    price: 5.2,
    result: "Дом закрыт от осадков и готов к следующему этапу.",
    items: ["SIP-конструкции дома", "кровля и фасад", "окна и наружные двери"],
  },
  {
    name: "Контур + инженерия",
    price: 6.3,
    result: "Дом с основными инженерными системами.",
    items: ["всё из тёплого контура", "электрика, вода и канализация", "отопление и вентиляция"],
  },
  {
    name: "С отделкой под ключ",
    price: 7.2,
    result: "Дом готов к меблировке и заселению.",
    items: ["контур и инженерия", "чистовая отделка", "двери и санузлы"],
  },
] as const;

const processSteps = [
  ["Участок", "Проверяем условия и понимаем, что влияет на итоговую стоимость."],
  ["Расчёт", "Выбираем VELA, комплектацию и собираем полный бюджет."],
  ["Договор", "Фиксируем согласованный состав, цену, срок и порядок изменений."],
  ["Стройка", "Вы видите этапы, фотографии и актуальный статус проекта."],
  ["Ключи", "Принимаем результат, закрываем замечания и передаём документы."],
] as const;

const faq = [
  ["Что входит в цену от 5,2 млн ₽?", "Это ориентир для комплектации «Тёплый контур». Земля не входит. Основание, наружные сети, доставка и особенности участка считаются после проверки исходных данных."],
  ["Можно ли строить по семейной ипотеке?", "Да, если семья соответствует условиям программы. Для строительства частного дома льготная ставка составляет 6%*. Строительство ведётся с подрядчиком и расчётами через эскроу."],
  ["Когда цена становится фиксированной?", "После проверки участка и согласования комплектации. Если потом меняется объём работ, сначала показываем новую сумму и влияние на срок — и только после вашего согласия вносим изменение."],
  ["Сколько длится строительство?", "Срок зависит от участка, комплектации и готовности исходных данных. Мы не обещаем универсальную дату: конкретный календарный срок фиксируется в договоре."],
  ["В SIP-доме не будет душно?", "Комфорт зависит от вентиляции, а не от красивого обещания материала. Схему вентиляции и состав инженерии определяем заранее и включаем в согласованный объём работ."],
  ["Можно приехать и посмотреть стройку?", "Да, если в этот момент есть объект, доступный для посещения. Подтвердим конкретный объект, стадию работ и безопасное время — без подмены рендером."],
] as const;

function Arrow() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>;
}

function Brand() {
  return <>
    <img src="/images/logo.webp" alt="" width="40" height="46" />
    <span><strong>ИКИОМА</strong><small>По-настоящему свой дом</small></span>
  </>;
}

function money(value: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(value));
}

function payment(principal: number, rate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0;
  if (rate === 0) return principal / (years * 12);
  const r = rate / 1200;
  return principal * r / (1 - Math.pow(1 + r, -years * 12));
}

declare global {
  interface Window {
    ym?: (id: number, action: string, goal: string, params?: Record<string, unknown>) => void;
    __IKIOMA_YM_ID?: number;
  }
}

function trackGoal(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("ikioma:goal", { detail: { name, params } }));
  const id = Number(window.__IKIOMA_YM_ID);
  if (id && typeof window.ym === "function") window.ym(id, "reachGoal", name, params);
}

type Modal = "lead" | "gallery" | "calculator" | "menu" | null;

export default function VelaLanding({ scenario = "base" }: { scenario?: LandingScenario }) {
  const [modal, setModal] = useState<Modal>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const submitLock = useRef(false);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedImage, setExpandedImage] = useState(0);
  const [offer, setOffer] = useState(0);
  const [land, setLand] = useState(scenario === "own-land" ? "Есть участок" : scenario === "land-home" ? "Нужна помощь с участком" : "Пока не определился");
  const [context, setContext] = useState("Расчёт VELA");
  const [form, setForm] = useState({ name: "", phone: "", comment: "", company: "", consent: false });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [receipt, setReceipt] = useState<LeadReceipt | null>(null);
  const [error, setError] = useState("");
  const [sticky, setSticky] = useState(false);
  const [price, setPrice] = useState(7.2);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(15);
  const [copy, setCopy] = useState<"idle" | "copied" | "manual">("idle");
  const [budgetFoundation, setBudgetFoundation] = useState(true);
  const [budgetWater, setBudgetWater] = useState(false);
  const [budgetSewer, setBudgetSewer] = useState(true);
  const [budgetPower, setBudgetPower] = useState(false);
  const hero = scenarioCopy[scenario];

  const total = price * 1_000_000;
  const loan = total * (1 - down / 100);
  const monthly = payment(loan, rate, years);
  const budgetKnownTotal = offers[offer].price * 1_000_000
    + (budgetFoundation ? optionPrices.foundation : 0)
    + (budgetSewer ? optionPrices.sewer : 0);
  const budgetPending = [
    land === "Нужна помощь с участком" ? "земля" : "",
    budgetWater ? "вода / скважина" : "",
    budgetPower ? "наружное электричество" : "",
  ].filter(Boolean);
  const budgetMortgage = payment(budgetKnownTotal * 0.8, 6, 15);

  const mortgageScenario = [
    "VELA: дом " + money(total) + " ₽",
    "взнос " + down + "% (" + money(total - loan) + " ₽)",
    "сумма " + money(loan) + " ₽",
    "ставка для расчёта " + rate + "%",
    years + " лет",
    "≈ " + money(monthly) + " ₽/мес",
    "без страховок, комиссий и стоимости земли",
  ].join("; ");

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (modal && !node.open) node.showModal();
    if (!modal && node.open) node.close();
    if (!modal) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [modal]);

  useEffect(() => {
    const hero = document.getElementById("top");
    const contact = document.getElementById("contacts");
    if (!hero || !contact) return;
    let heroVisible = true;
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        if (entry.target === contact) contactVisible = entry.isIntersecting;
      }
      setSticky(!heroVisible && !contactVisible);
    });
    observer.observe(hero);
    observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => request.current?.abort(), []);

  function openLead(source: string, choice?: number, landChoice?: string, goalName = "lead_open") {
    if (submitLock.current) { setModal("lead"); return; }
    trackGoal(goalName, { source, package: choice ?? offer });
    setContext(source);
    if (choice !== undefined) setOffer(choice);
    if (landChoice) setLand(landChoice);
    setStatus("idle");
    setReceipt(null);
    setError("");
    setModal("lead");
  }

  function openCalculator() {
    trackGoal("mortgage_calculator_open");
    setCopy("idle");
    setRate(6);
    setModal("calculator");
  }

  function showImage(index: number) {
    setExpandedImage(index);
    setModal("gallery");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || form.company) return;
    const phone = normalizePhone(form.phone);
    if (!form.name.trim() || !phone || !form.consent) {
      setError(!phone ? "Проверьте телефон: укажите номер с кодом страны, например +7 999 123-45-67." : "Укажите имя и согласие на обработку контактов.");
      setStatus("error");
      return;
    }

    submitLock.current = true;
    setStatus("sending");
    setError("");
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    const message = leadMessage({
      context,
      layout: "VELA · 3 спальни",
      offer: offers[offer].name,
      land,
      comment: form.comment,
      query: window.location.search,
      release: RELEASE,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), phone, email: "", source: "website", message, website: "ikioma.ru" }),
      });
      if (!response.ok) throw new Error(response.status === 429 ? "rate_limit" : "lead_rejected");
      const type = response.headers.get("content-type") || "";
      if (!type.includes("application/json")) throw new Error("invalid_response");
      const confirmed = parseLeadReceipt(response.status, await response.json());
      setReceipt(confirmed);
      setStatus("sent");
      trackGoal("lead_success", { context, package: offers[offer].name });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message === "rate_limit"
        ? "Слишком много попыток. Подождите немного перед повторной отправкой."
        : "Не удалось подтвердить получение заявки. Введённые данные сохранены. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      window.clearTimeout(timeout);
      request.current = null;
      submitLock.current = false;
    }
  }

  return <div className="vela v-clean" data-release={RELEASE}>
    <a className="v-skip" href="#main">К содержанию</a>

    <header className="v-header">
      <div className="v-shell v-header-inner">
        <a href="#top" className="v-brand" aria-label="ИКИОМА — на главную"><Brand /></a>
        <nav className="v-nav" aria-label="Основная навигация">
          {nav.map(([id, label]) => <a key={id} href={"#" + id}>{label}</a>)}
        </nav>
        <button className="v-button v-button-small v-header-cta" data-goal="lead_open_header" onClick={() => openLead("Заявка из шапки", undefined, undefined, "lead_open_header")}>Рассчитать дом <Arrow /></button>
        <button className="v-menu-button" onClick={() => setModal("menu")} aria-expanded={modal === "menu"} aria-label="Открыть меню" aria-haspopup="dialog"><span /><span /></button>
      </div>
    </header>

    <main id="main">
      <section className="v-hero v-clean-hero" id="top" data-section="hero">
        <img className="v-hero-image" src={gallery[0].src} alt={gallery[0].alt} fetchPriority="high" width="1536" height="1024" />
        <div className="v-shell v-hero-content">
          <div className="v-hero-main">
            <p className="v-eyebrow">{hero.eyebrow}</p>
            <h1><span>{hero.first}</span><em>{hero.second}</em></h1>
            <p className="v-hero-text">{hero.text}</p>
            <div className="v-hero-commercial">
              <div className="v-hero-price-simple"><span>от</span><strong>5,2 млн ₽</strong><small>тёплый контур</small></div>
              <a className="v-mortgage-chip" href="#mortgage"><strong>6%*</strong><span>семейная ипотека<br />на строительство</span></a>
            </div>
            <div className="v-actions">
              <button className="v-button" data-goal="lead_open_hero" onClick={() => openLead("Первый экран — " + hero.cta, undefined, undefined, "lead_open_hero")}>{hero.cta} <Arrow /></button>
              <a className="v-button v-outline" href="#finance">Смотреть комплектации</a>
            </div>
          </div>
        </div>
        <div className="v-shell v-hero-bottom">
          <dl className="v-facts">
            <div><dt>Внутри</dt><dd>86,2 <small>м²</small></dd></div>
            <div><dt>Терраса</dt><dd>23,1 <small>м²</small></dd></div>
            <div><dt>Спальни</dt><dd>3</dd></div>
            <div><dt>Этаж</dt><dd>1</dd></div>
          </dl>
          <span className="v-media-note">Визуализация</span>
          <p className="v-geo-line">Строим: Санкт-Петербург · Ленинградская область · Москва · Московская область</p>
        </div>
      </section>

      <div className={"v-section-stack v-scenario-" + scenario}>
      <section className="v-section v-shell v-house-clean" id="house" data-section="product" style={{ order: 1 }}>
        <div className="v-heading">
          <div><p className="v-eyebrow">01 / Дом VELA</p><h2>Всё нужное.<br /><em>Без лишней площади.</em></h2></div>
          <p>Один этаж без лестниц. Общая зона для семьи, отдельные спальни и крытая терраса, которой действительно будут пользоваться.</p>
        </div>

        <div className="v-gallery v-gallery-clean">
          <figure>
            <button className="v-image-button" onClick={() => showImage(activeImage)} aria-label={"Увеличить: " + gallery[activeImage].label}>
              <img src={gallery[activeImage].src} alt={gallery[activeImage].alt} loading="lazy" decoding="async" width="1536" height="1024" />
              <span className="v-enlarge">Увеличить ↗</span>
            </button>
          </figure>
          <div className="v-gallery-copy">
            <div className="v-pills" aria-label="Виды дома">
              {gallery.map((item, index) => <button key={item.label} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}>{item.label}</button>)}
            </div>
            <div aria-live="polite"><h3>{gallery[activeImage].title}</h3><p>{gallery[activeImage].text}</p></div>
            <div className="v-home-facts">
              <span><strong>27,3 м²</strong>кухня-гостиная</span>
              <span><strong>3</strong>спальни</span>
              <span><strong>2</strong>санузла</span>
            </div>
            <p className="v-visual-note">Изображения показывают архитектуру и сценарий будущего дома.</p>
          </div>
        </div>
      </section>

      <section className="v-section v-dark v-packages-clean" id="finance" data-section="offers" style={{ order: scenario === "mortgage" ? 3 : scenario === "land-home" ? 3 : 2 }}>
        <div className="v-shell">
          <div className="v-heading">
            <div><p className="v-eyebrow">02 / Комплектации</p><h2>Понятная цена.<br /><em>Понятный результат.</em></h2></div>
            <p>Выберите не список работ, а состояние дома, которое хотите получить. Для каждой комплектации считаем один полный объём.</p>
          </div>

          <a className="v-section-mortgage-link" href="#mortgage"><strong>Семейная ипотека — 6%*</strong><span>Можно использовать для строительства дома при соответствии условиям программы.</span><Arrow /></a>

          <div className="v-package-selector" role="radiogroup" aria-label="Выберите комплектацию">
            {offers.map((item, index) => <button
              type="button"
              role="radio"
              aria-checked={offer === index}
              className={"v-package-card" + (offer === index ? " active" : "")}
              onClick={() => { setOffer(index); trackGoal("package_select", { package: item.name }); }}
              key={item.name}
            >
              <span className="v-package-index">0{index + 1}</span>
              <h3>{item.name}</h3>
              <div className="v-offer-price">от {item.price.toFixed(1).replace(".", ",")} <small>млн ₽</small></div>
              <p>{item.result}</p>
              <ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul>
              <span className="v-package-select">{offer === index ? "Выбрано" : "Выбрать"}</span>
            </button>)}
          </div>

          <div className="v-package-action">
            <div><strong>{offers[offer].name}</strong><span>от {offers[offer].price.toFixed(1).replace(".", ",")} млн ₽</span></div>
            <button className="v-button" data-goal="lead_open_package" onClick={() => openLead("Расчёт комплектации: " + offers[offer].name, offer, undefined, "lead_open_package")}>Рассчитать эту комплектацию <Arrow /></button>
          </div>

          <div className="v-price-simple-note">
            <strong>Что считается отдельно</strong>
            <p>Земля, основание, наружные сети, доставка и индивидуальные изменения — только после проверки условий участка. Никаких скрытых пунктов внутри красивой стартовой цены.</p>
          </div>

          <div className="v-price-fix">
            <div><p className="v-eyebrow">Как фиксируем цену</p><h3>Сначала сумма.<br />Потом работа.</h3></div>
            <ol>
              <li><span>01</span><strong>Считаем полный объём</strong><p>Дом, участок и выбранные опции видны отдельными строками.</p></li>
              <li><span>02</span><strong>Фиксируем в договоре</strong><p>Согласованный состав, цена и срок становятся базой проекта.</p></li>
              <li><span>03</span><strong>Изменения — только с вами</strong><p>Сначала новая цена и срок. Затем ваше согласие. Потом работа.</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section className="v-section v-real-budget" id="real-budget" data-section="real-budget" style={{ order: scenario === "mortgage" ? 4 : scenario === "land-home" ? 4 : scenario === "own-land" ? 4 : 3 }}>
        <div className="v-shell">
          <div className="v-heading">
            <div><p className="v-eyebrow">Реальный расчёт</p><h2>Не «типовой участок».<br /><em>Настоящая смета.</em></h2></div>
            <p>Обезличили один из текущих проектов ИКИОМА и сложили заполненные строки рабочего плана. Это не цена VELA и не оферта — это пример того, как выглядит реальный бюджет строительства.</p>
          </div>
          <div className="v-real-budget-grid">
            <div className="v-real-budget-list">
              <div className="v-real-budget-meta"><span>{realProjectBudget.label}</span><strong>{realProjectBudget.scope}</strong></div>
              <dl>{realProjectBudget.items.map(([name, amount]) => <div key={name}><dt>{name}</dt><dd>{money(amount)} ₽</dd></div>)}</dl>
              <div className="v-real-budget-missing">
                <span>В исходной смете пока не оценено</span>
                <p>Вода / скважина <strong>—</strong></p>
                <p>Наружное электричество <strong>—</strong></p>
                <p>Остальная инженерия сверх септика <strong>—</strong></p>
              </div>
              <div className="v-real-budget-total"><span>Итого по оцененным строкам</span><strong>{money(realProjectBudget.total)} ₽</strong></div>
              <small>Источник: рабочая смета проекта от {realProjectBudget.date}. Это реальный промежуточный бюджет, а не финальная стоимость готового дома: неоценённые работы показаны отдельно и не превращены в ноль.</small>
            </div>
            <div className="v-real-budget-mortgage">
              <span>Если применить семейную ипотеку 6%*</span>
              <strong>≈ {money(realProjectBudget.mortgagePayment)} ₽<small>/мес</small></strong>
              <p>Математический пример: 20% собственных средств, 15 лет. Не банковское предложение.</p>
              <button className="v-button v-button-dark" onClick={openCalculator}>Посчитать свой платёж <Arrow /></button>
            </div>
          </div>
        </div>
      </section>

      <section className="v-section v-shell v-budget-builder" id="calculator-home" data-section="budget" style={{ order: scenario === "mortgage" ? 5 : scenario === "own-land" ? 3 : scenario === "land-home" ? 2 : 4 }}>
        <div className="v-heading">
          <div><p className="v-eyebrow">Сколько будет стоить мой VELA?</p><h2>Шесть решений.<br /><em>Один ориентир бюджета.</em></h2></div>
          <p>Это не квиз на 25 вопросов. Выберите только то, что действительно меняет первый расчёт. Неизвестные по участку суммы не придумываем.</p>
        </div>
        <div className="v-budget-builder-grid">
          <div className="v-budget-controls">
            <fieldset>
              <legend>Участок</legend>
              <div className="v-choice-pair">
                <button type="button" aria-pressed={land === "Есть участок"} onClick={() => setLand("Есть участок")}>Участок есть</button>
                <button type="button" aria-pressed={land === "Нужна помощь с участком"} onClick={() => setLand("Нужна помощь с участком")}>Участка нет</button>
              </div>
            </fieldset>
            <fieldset>
              <legend>Комплектация</legend>
              <div className="v-choice-list">{offers.map((item, index) => <button type="button" key={item.name} aria-pressed={offer === index} onClick={() => setOffer(index)}><span>{item.name}</span><strong>от {item.price.toFixed(1).replace(".", ",")} млн ₽</strong></button>)}</div>
            </fieldset>
            <fieldset>
              <legend>Что добавить в первый ориентир</legend>
              <div className="v-toggle-list">
                <label><input type="checkbox" checked={budgetFoundation} onChange={e => setBudgetFoundation(e.target.checked)} /><span>Фундамент</span><strong>+ {money(optionPrices.foundation)} ₽</strong></label>
                <label><input type="checkbox" checked={budgetWater} onChange={e => setBudgetWater(e.target.checked)} /><span>Вода / скважина</span><strong>по участку</strong></label>
                <label><input type="checkbox" checked={budgetSewer} onChange={e => setBudgetSewer(e.target.checked)} /><span>Канализация / септик</span><strong>+ {money(optionPrices.sewer)} ₽</strong></label>
                <label><input type="checkbox" checked={budgetPower} onChange={e => setBudgetPower(e.target.checked)} /><span>Наружное электричество</span><strong>по участку</strong></label>
              </div>
            </fieldset>
          </div>
          <div className="v-budget-result" aria-live="polite">
            <p className="v-eyebrow">Первый ориентир</p>
            <strong className="v-budget-sum">от {money(budgetKnownTotal)} ₽</strong>
            {budgetPending.length ? <p>+ после проверки: {budgetPending.join(", ")}</p> : <p>Все выбранные позиции имеют ориентир.</p>}
            <dl>
              <div><dt>Комплектация</dt><dd>{offers[offer].name}</dd></div>
              <div><dt>Ипотечный платёж*</dt><dd>≈ {money(budgetMortgage)} ₽/мес</dd></div>
            </dl>
            <button className="v-button" data-goal="budget_configurator_lead" onClick={() => openLead(
              "Конфигуратор VELA: " + offers[offer].name + "; " + land + "; фундамент=" + (budgetFoundation ? "да" : "нет") + "; вода=" + (budgetWater ? "да" : "нет") + "; канализация=" + (budgetSewer ? "да" : "нет") + "; электричество=" + (budgetPower ? "да" : "нет") + "; ориентир=" + money(budgetKnownTotal) + " ₽",
              offer,
              land,
              "budget_configurator_lead",
            )}>Получить точный расчёт <Arrow /></button>
            <small>* Фундамент и септик — ориентиры из текущего реального проекта ИКИОМА; для VELA они уточняются по участку. Расчёт платежа: 20% собственных средств, ставка 6%, срок 15 лет; без страховок и комиссий. Позиции «по участку» в платёж пока не включены.</small>
          </div>
        </div>
      </section>

      <section className="v-section v-mortgage-section" id="mortgage" data-section="mortgage" style={{ order: scenario === "mortgage" ? 2 : 5 }}>
        <div className="v-shell v-mortgage-grid">
          <div className="v-mortgage-number"><strong>6%</strong><span>семейная ипотека*</span></div>
          <div className="v-mortgage-copy">
            <p className="v-eyebrow">03 / Семейная ипотека</p>
            <h2>Строительство дома<br /><em>по льготной ставке.</em></h2>
            <p>С 1 октября 2026 года для строительства частного дома, его завершения и покупки земли с последующим строительством ставка семейной ипотеки сохраняется на уровне 6%* — вне зависимости от количества детей и региона проживания семьи, если семья соответствует условиям программы.</p>
            <div className="v-mortgage-points">
              <span>строительство на своём участке</span>
              <span>земля + строительство дома</span>
              <span>подрядчик и расчёты через эскроу</span>
            </div>
            <button className="v-button v-button-dark" data-goal="mortgage_calculator_open" onClick={openCalculator}>Рассчитать платёж <Arrow /></button>
            <small>* Максимальный срок субсидирования по новым договорам — до 15 лет. Решение о выдаче кредита и полные условия определяет банк. Информация актуальна на {MORTGAGE_DATE}.</small>
          </div>
        </div>
      </section>

      <section className="v-section v-shell v-process-clean" id="process" data-section="process" style={{ order: 6 }}>
        <div className="v-heading">
          <div><p className="v-eyebrow">04 / Как строим</p><h2>От участка<br /><em>до своих ключей.</em></h2></div>
          <p>Пять понятных шагов. На каждом вы знаете, что происходит сейчас, какой результат ждём и что будет дальше.</p>
        </div>

        <ol className="v-process-five">
          {processSteps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{text}</p></li>)}
        </ol>

        <div className="v-why-grid">
          <article><span>01</span><h3>Цена до старта.</h3><p>Согласованный объём фиксируется до начала работ.</p></article>
          <article><span>02</span><h3>Срок в договоре.</h3><p>Не обещаем одну дату всем участкам — считаем ваш проект.</p></article>
          <article><span>03</span><h3>Стройка видна.</h3><p>Этапы, фотографии и актуальный статус проекта собраны в одном месте.</p></article>
          <article><span>04</span><h3>Регистрацию сопровождаем.</h3><p>Заранее определяем, какие действия берём на себя и где нужны документы собственника.</p></article>
        </div>

        <div className="v-live-visit">
          <div><p className="v-eyebrow">Посмотреть до договора</p><h3>Приезжайте на доступную стройку ИКИОМА.</h3><p>Проверим, какой объект сейчас можно показать, на какой он стадии и когда безопасно приехать.</p></div>
          <button className="v-button" data-goal="visit_request" onClick={() => openLead("Запрос на просмотр доступного строящегося объекта ИКИОМА", undefined, undefined, "visit_request")}>Запросить просмотр <Arrow /></button>
        </div>
      </section>

      <section className="v-section v-soft v-faq-clean" id="questions" data-section="faq" style={{ order: 7 }}>
        <div className="v-shell v-faq">
          <div><p className="v-eyebrow">05 / Главное перед решением</p><h2>Коротко.<br /><em>Без строительного тумана.</em></h2></div>
          <div>{faq.map(([q, a]) => <details className="v-details" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
        </div>

        <div className="v-shell v-contact v-contact-clean" id="contacts">
          <div>
            <p className="v-eyebrow">VELA · семейная ипотека 6%*</p>
            <h2>Посчитаем ваш дом<br /><em>целиком.</em></h2>
            <p>Комплектация, участок, семейная ипотека и полный бюджет — в одном расчёте.</p>
          </div>
          <div>
            <button className="v-button" data-goal="lead_open_final" onClick={() => openLead("Финальная заявка — полный расчёт VELA", undefined, undefined, "lead_open_final")}>Получить полный расчёт <Arrow /></button>
            <span className="v-note">Имя и телефон. Остальное можно обсудить после расчёта.</span>
          </div>
        </div>
      </section>
      </div>
    </main>

    <footer className="v-footer">
      <div className="v-shell">
        <div className="v-footer-top">
          <a className="v-brand" href="#top" aria-label="ИКИОМА — наверх"><Brand /></a>
          <p>VELA · SIP-дом для семьи · СПб / Ленобласть / Москва / Московская область</p>
          <a className="v-text-link" href="#mortgage">Семейная ипотека 6%* <Arrow /></a>
        </div>
        <div className="v-footer-bottom">
          <span>© 2026 ИКИОМА</span>
          <p>* Семейная ипотека: ставка 6% на строительство частного дома для семей, соответствующих условиям программы; строительство с подрядчиком и расчётами через эскроу. Решение принимает банк. Цены на сайте — ориентиры до проверки участка и согласования комплектации.</p>
          <a href="#top">Наверх ↑</a>
        </div>
      </div>
    </footer>

    {sticky && !modal && <div className="v-sticky">
      <span><small>Семейная ипотека</small><strong>6%*</strong></span>
      <button className="v-button v-button-small" data-goal="lead_open_sticky" onClick={() => openLead("Мобильная панель — расчёт VELA", undefined, undefined, "lead_open_sticky")}>Рассчитать дом <Arrow /></button>
    </div>}

    <dialog
      ref={dialog}
      className={"v-dialog" + (modal === "gallery" ? " v-dialog-gallery" : "") + (modal === "menu" ? " v-dialog-menu" : "")}
      aria-labelledby="v-dialog-title"
      onCancel={(event) => { event.preventDefault(); setModal(null); }}
      onClose={() => setModal(null)}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const r = event.currentTarget.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) setModal(null);
      }}
    >
      <button type="button" className="v-close" onClick={() => setModal(null)} aria-label="Закрыть окно"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>

      {modal === "menu" && <div className="v-dialog-body">
        <h2 id="v-dialog-title">ИКИОМА</h2>
        <nav aria-label="Мобильная навигация">{nav.map(([id, label]) => <a key={id} href={"#" + id} onClick={() => setModal(null)}>{label}<Arrow /></a>)}</nav>
        <button className="v-button" onClick={() => openLead("Мобильное меню", undefined, undefined, "lead_open_menu")}>Рассчитать дом <Arrow /></button>
      </div>}

      {modal === "gallery" && <div className="v-lightbox">
        <h2 id="v-dialog-title">{gallery[expandedImage].title}</h2>
        <img src={gallery[expandedImage].src} alt={gallery[expandedImage].alt} />
        <p>Визуализация дома VELA</p>
        <div className="v-pills" aria-label="Изображения дома">{gallery.map((item, index) => <button key={item.label} aria-pressed={index === expandedImage} onClick={() => setExpandedImage(index)}>{item.label}</button>)}</div>
      </div>}

      {modal === "lead" && <div className="v-dialog-body">
        {status === "sent" ? <div className="v-success" role="status" data-lead-id={receipt?.leadId || undefined}>
          <span className="v-success-mark" aria-hidden="true">✓</span>
          <p className="v-eyebrow">{receipt?.duplicate ? "Заявка с этим телефоном уже получена" : "Заявка получена"}</p>
          <h2 id="v-dialog-title">Спасибо, {form.name}.</h2>
          <p>{receipt?.duplicate ? "Вы уже отправляли заявку недавно. Обсудим детали при разговоре." : "Свяжемся по указанному телефону, чтобы обсудить дом, участок и семейную ипотеку."}</p>
          <button className="v-button v-button-dark" onClick={() => setModal(null)}>Вернуться на сайт</button>
        </div> : <form onSubmit={submit} aria-busy={status === "sending"}>
          <p className="v-eyebrow">VELA · семейная ипотека 6%*</p>
          <h2 id="v-dialog-title">Рассчитать дом.</h2>
          <p className="v-form-intro">Оставьте контакты. Выбранная комплектация и источник рекламы передадутся вместе с заявкой.</p>
          <fieldset disabled={status === "sending"} className="v-form-fields">
            <label>Как к вам обращаться<input name="name" required maxLength={100} autoComplete="name" placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
            <label>Телефон<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="+7 999 123-45-67" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
            <label>Комплектация<select value={offer} onChange={e => setOffer(Number(e.target.value))}>{offers.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select></label>
            <label>Участок<select value={land} onChange={e => setLand(e.target.value)}><option>Пока не определился</option><option>Есть участок</option><option>Выбираю самостоятельно</option><option>Нужна помощь с участком</option></select></label>
            <details className="v-details v-form-extra"><summary>Добавить пожелания</summary><label>Комментарий, до 300 символов<textarea rows={3} maxLength={300} placeholder="Район, бюджет, желаемая дата начала" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></label><p className="v-note">{context}</p></details>
            <label className="v-honeypot" aria-hidden="true">Компания<input autoComplete="off" tabIndex={-1} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label>
            <label className="v-consent"><input type="checkbox" required checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /><span>Согласен на обработку имени, телефона и переданных пожеланий для ответа на эту заявку.</span></label>
          </fieldset>
          {status === "error" && <p className="v-error" role="alert">{error}</p>}
          <button type="submit" disabled={status === "sending"} className="v-button v-submit">{status === "sending" ? "Отправляем…" : "Отправить заявку"}<Arrow /></button>
          <p className="v-note">* Ипотека доступна при соответствии условиям программы и одобрении банка.</p>
        </form>}
      </div>}

      {modal === "calculator" && <div className="v-dialog-body">
        <p className="v-eyebrow">Семейная ипотека · 6%*</p>
        <h2 id="v-dialog-title">Посчитайте платёж.</h2>
        <p className="v-form-intro">По умолчанию — 6% для строительства частного дома. С 1 октября 2026 года эта ставка сохраняется независимо от количества детей и региона, если семья соответствует условиям программы.</p>
        <div className="v-calc">
          <div className="v-calc-controls">
            <label><span>Стоимость дома <strong>{price.toFixed(1).replace(".", ",")} млн ₽</strong></span><input aria-label="Стоимость дома в миллионах рублей" type="range" min="5.2" max="14" step="0.1" value={price} onChange={e => { setPrice(Number(e.target.value)); setCopy("idle"); }} /></label>
            <label><span>Первоначальный взнос <strong>{down}%</strong></span><input aria-label="Первоначальный взнос в процентах" type="range" min="0" max="100" step="5" value={down} onChange={e => { setDown(Number(e.target.value)); setCopy("idle"); }} /></label>
            <div className="v-calc-selects">
              <label>Ставка, %<input type="number" min="0" max="100" step="0.1" value={rate} onChange={e => { setRate(Math.max(0, Math.min(100, Number(e.target.value) || 0))); setCopy("idle"); }} /></label>
              <label>Срок<select value={years} onChange={e => { setYears(Number(e.target.value)); setCopy("idle"); }}>{[5, 10, 15].map(year => <option key={year} value={year}>{year} лет</option>)}</select></label>
            </div>
          </div>
          <div className="v-calc-result" aria-live="polite">
            <span>Ориентировочный платёж</span>
            <strong>≈ {money(monthly)} ₽<small>/мес</small></strong>
            <dl><div><dt>Ваш взнос</dt><dd>{money(total - loan)} ₽</dd></div><div><dt>Финансирование</dt><dd>{money(loan)} ₽</dd></div></dl>
            <button className="v-button v-button-dark" onClick={() => openLead(mortgageScenario, undefined, undefined, "lead_open_mortgage")}>Обсудить этот расчёт <Arrow /></button>
            <button className="v-text-link" onClick={async () => { try { await navigator.clipboard.writeText(mortgageScenario); setCopy("copied"); } catch { setCopy("manual"); } }}>{copy === "copied" ? "Расчёт скопирован" : "Скопировать расчёт"}</button>
          </div>
        </div>
        {copy === "manual" && <label className="v-copy-fallback">Выделите и скопируйте расчёт<textarea readOnly value={mortgageScenario} rows={4} onFocus={e => e.target.select()} /></label>}
        <p className="v-note">* Математический ориентир, не предложение банка. Не учитывает страховки и комиссии. Максимальный срок субсидирования по новым договорам — до 15 лет; право на программу и итоговые условия определяет банк.</p>
      </div>}
    </dialog>
  </div>;
}
