"use client";

/* eslint-disable @next/next/no-img-element -- existing local, optimized product assets */

import { useEffect, useRef, useState, type FormEvent } from "react";

const LEAD_ENDPOINT = "https://stroios-188-225-38-55.sslip.io/api/public/leads";
const RELEASE = "vela-structure-20260924";
const nav = [["house", "Дом"], ["plan", "Планировка"], ["finance", "Комплектации"], ["process", "Как строим"], ["contacts", "Связаться"]] as const;
const gallery = [
  { src: "/images/kontur-family-exterior-v1.webp", label: "Архитектура", title: "Спокойная архитектура. Свой характер.", text: "Один этаж, лаконичный фасад и крытая терраса под общей кровлей.", caption: "Архитектурная визуализация · не фотография построенного объекта" },
  { src: "/images/kontur-family-interior-v1.webp", label: "Кухня-гостиная", title: "Место, где собирается семья.", text: "Кухня-гостиная 27,3 м²: место для приготовления ужина, большого стола и вечера вместе.", caption: "Визуализация интерьера · мебель и декор не определяют состав комплектации" },
  { src: "/images/kontur-covered-terrace-v1.webp", label: "Терраса", title: "Ещё одна комната. На свежем воздухе.", text: "Крытая терраса 23,1 м² примыкает к кухне-гостиной — для завтраков и неспешных вечеров.", caption: "Архитектурная визуализация · не фотография построенного объекта" },
  { src: "/images/kontur-plan.jpg", label: "Технический план", title: "Планировка с тремя спальнями", text: "86,2 м² внутренних помещений. Терраса 23,1 м² и крыльцо 4,5 м² учитываются отдельно.", caption: "Технический альбом АРО-96 · проект в Коробицино · лист 9" },
  { src: "/images/kontur-terrace-technical.jpg", label: "Конструкция", title: "Терраса под общей кровлей", text: "Фрагмент технического проекта: опоры, основание и примыкание террасы к дому.", caption: "Техническая модель · не фотография готового дома" },
] as const;
const rooms = [["Кухня-гостиная", "27,3"], ["Спальня 1", "14,4"], ["Спальня 2", "12,4"], ["Спальня 3", "11,0"], ["Входная зона", "7,5"], ["Санузел 1", "5,5"], ["Холл", "4,2"], ["Санузел 2", "3,9"]] as const;
const offers = [
  { name: "Тёплый контур", price: 5.2, short: "Контур", result: "Закрытый дом для следующего этапа работ.", items: ["SIP-пол, наружные стены и кровля", "Внутренние каркасные перегородки", "Оконные блоки", "Кровельное покрытие и фасад"] },
  { name: "Контур + инженерия", price: 6.3, short: "+ инженерия", result: "Тёплый контур с инженерным пакетом по проекту.", items: ["Весь состав тёплого контура", "Вода, канализация и электрика", "Отопление и вентиляция", "Оборудование и границы монтажа — в смете"] },
  { name: "С отделкой под ключ", price: 7.2, short: "Под ключ", result: "Дом с инженерией и согласованной чистовой отделкой.", items: ["Контур и инженерные системы", "Отделка пола, стен и потолков", "Межкомнатные двери и санузлы", "Приёмка и документы на выполненные работы"] },
] as const;
const comparison = [
  ["SIP-контур, кровля, фасад, окна", "Входит", "Входит", "Входит"],
  ["Инженерные системы внутри дома", "Не входит", "По проекту", "По проекту"],
  ["Чистовая отделка", "Не входит", "Не входит", "По ведомости"],
  ["Входная дверь и её характеристики", "По спецификации", "По спецификации", "По спецификации"],
  ["Фундамент и подготовка участка", "Отдельный расчёт", "Отдельный расчёт", "Отдельный расчёт"],
  ["Наружные сети, вода и септик", "Отдельный расчёт", "Границы по смете", "Границы по смете"],
  ["Доставка и индивидуальные изменения", "Уточняются", "Уточняются", "Уточняются"],
  ["Земельный участок", "Не входит", "Не входит", "Не входит"],
] as const;
const steps = [["Заявка", "Обсуждаем семью, участок и желаемый результат."], ["Участок", "Проверяем исходные данные и условия строительства."], ["Расчёт", "Согласуем планировку, комплектацию и смету."], ["Договор", "Фиксируем состав, цену, график и порядок приёмки."], ["Стройка", "Выполняем работы, проверяем узлы и фиксируем этапы."], ["Приёмка", "Осматриваем результат и закрываем замечания."], ["Ключи", "Передаём дом и согласованный комплект документов."]] as const;
const faq = [
  ["Как узнать полную стоимость дома?", "Цены комплектаций на сайте — предварительные ориентиры. Полный расчёт подготовим после проверки участка, планировки, основания и выбранного уровня готовности. В предложении отдельно обозначим включённые работы, дополнительные расходы и условия изменения цены."],
  ["Можно ли сделать две спальни вместо трёх?", "Да, такую задачу можно обсудить при согласовании проекта. Сейчас на сайте показан технический план с тремя спальнями. Схему с двумя спальнями, площади и стоимость изменений согласуем отдельно — до договора."],
  ["Можно обратиться, если участка ещё нет?", "Да. Начнём с требований к району, бюджету, подъезду и коммуникациям. Стоимость земли и расходы по её покупке не входят в цену дома."],
  ["Что с отоплением и вентиляцией?", "Состав систем, оборудование и точки подключения определяются инженерным проектом и выбранной комплектацией. Для инженерного пакета отдельно согласуем границы внутренних и наружных работ."],
  ["Когда будет готов дом?", "Календарный график составляем под конкретный участок, объём работ и поставки. Срок и условия начала строительства фиксируем в договоре. Пример графика другого объекта не является сроком вашего дома."],
  ["Как устроены приёмка и гарантия?", "При приёмке сверяем выполненные работы с проектом и спецификацией, фиксируем замечания. Срок гарантии, её объём, исключения и порядок обращения указываются в договоре конкретного проекта."],
] as const;

function Arrow() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" /></svg>; }
function Brand() { return <><img src="/images/logo.webp" alt="" width="40" height="46" /><span><strong>ИКИОМА</strong><small>По-настоящему свой дом</small></span></>; }
function money(value: number) { return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(value)); }
function payment(principal: number, rate: number, years: number) {
  if (principal <= 0 || years <= 0) return 0;
  if (rate === 0) return principal / (years * 12);
  const r = rate / 1200;
  return principal * r / (1 - Math.pow(1 + r, -years * 12));
}
function normalizePhone(value: string) {
  if (!/^[+\d\s()\-]+$/.test(value.trim())) return null;
  let digits = value.replace(/\D/g, "");
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length === 11 && digits.startsWith("8")) digits = `7${digits.slice(1)}`;
  return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
}

type Modal = "lead" | "gallery" | "calculator" | "menu" | null;

export default function VelaLanding() {
  const [modal, setModal] = useState<Modal>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const request = useRef<AbortController | null>(null);
  const submitLock = useRef(false);
  const [activeImage, setActiveImage] = useState(0);
  const [expandedImage, setExpandedImage] = useState(0);
  const [offer, setOffer] = useState(0);
  const [layout, setLayout] = useState("3 спальни");
  const [land, setLand] = useState("Пока не определился");
  const [context, setContext] = useState("Расчёт VELA");
  const [form, setForm] = useState({ name: "", phone: "", comment: "", company: "", consent: false });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [sticky, setSticky] = useState(false);
  const [price, setPrice] = useState(7.2);
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(30);
  const [copy, setCopy] = useState<"idle" | "copied" | "manual">("idle");
  const total = price * 1_000_000;
  const loan = total * (1 - down / 100);
  const monthly = payment(loan, rate, years);
  const scenario = `VELA: дом ${money(total)} ₽; взнос ${down}% (${money(total - loan)} ₽); сумма ${money(loan)} ₽; условная ставка ${rate}%; ${years} лет; ≈ ${money(monthly)} ₽/мес. Без страховок и комиссий.`;

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
    observer.observe(hero); observer.observe(contact);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => request.current?.abort(), []);

  function openLead(source: string, choice?: number, landChoice?: string, layoutChoice?: string) {
    if (submitLock.current) { setModal("lead"); return; }
    setContext(source);
    if (choice !== undefined) setOffer(choice);
    if (landChoice) setLand(landChoice);
    if (layoutChoice) setLayout(layoutChoice);
    setStatus("idle"); setError(""); setModal("lead");
  }
  function showImage(index: number) { setExpandedImage(index); setModal("gallery"); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitLock.current || form.company) return;
    const phone = normalizePhone(form.phone);
    if (!form.name.trim() || !phone || !form.consent) {
      setError(!phone ? "Проверьте телефон: укажите номер с кодом страны, например +7 999 123-45-67." : "Укажите имя и согласие на обработку контактов.");
      setStatus("error"); return;
    }
    submitLock.current = true; setStatus("sending"); setError("");
    const controller = new AbortController(); request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15_000);
    const params = new URLSearchParams(window.location.search);
    const utm = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].map(key => params.get(key) ? `${key}: ${params.get(key)!.slice(0, 160)}` : "").filter(Boolean);
    const message = [context, `Модель: VELA. Планировка: ${layout}.`, `Комплектация: ${offers[offer].name}.`, `Участок: ${land}.`, form.comment.trim(), ...utm, `Согласие на обработку контактов для ответа на заявку: ${new Date().toISOString()}. Версия формы: ${RELEASE}.`].filter(Boolean).join("\n");
    try {
      const response = await fetch(LEAD_ENDPOINT, { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name.trim(), phone, email: "", source: "website", message, website: "ikioma.ru" }) });
      if (!response.ok) throw new Error(response.status === 429 ? "rate_limit" : "lead_rejected");
      const type = response.headers.get("content-type") || "";
      if (!type.includes("application/json")) throw new Error("invalid_response");
      const result = await response.json();
      if (!result || typeof result !== "object" || result.ok === false || result.success === false || result.error) throw new Error("lead_rejected");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error && err.message === "rate_limit" ? "Слишком много попыток. Подождите немного перед повторной отправкой." : "Не удалось подтвердить получение заявки. Введённые данные сохранены в открытой форме. Проверьте соединение перед повторной отправкой.");
    } finally {
      window.clearTimeout(timeout); request.current = null; submitLock.current = false;
    }
  }

  return <div className="vela" data-release={RELEASE}>
    <a className="v-skip" href="#main">К содержанию</a>
    <header className="v-header"><div className="v-shell v-header-inner">
      <a href="#top" className="v-brand" aria-label="ИКИОМА — на главную"><Brand /></a>
      <nav className="v-nav" aria-label="Основная навигация">{nav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <button className="v-button v-button-small v-header-cta" onClick={() => openLead("Заявка из шапки")}>Получить расчёт <Arrow /></button>
      <button className="v-menu-button" onClick={() => setModal("menu")} aria-label="Открыть меню" aria-haspopup="dialog"><span /><span /></button>
    </div></header>

    <main id="main">
      <section className="v-hero" id="top" data-section="hero">
        <img className="v-hero-image" src={gallery[0].src} alt="Архитектурная визуализация дома VELA с крытой террасой" fetchPriority="high" width="1536" height="1024" />
        <div className="v-shell v-hero-content">
          <p className="v-eyebrow">ИКИОМА / Одноэтажный дом</p>
          <h1>VELA.<br /><em>По-настоящему свой.</em></h1>
          <p className="v-hero-text">Три спальни, просторная кухня-гостиная и крытая терраса. Место для семьи — и для себя.</p>
          <a href="#finance" className="v-hero-price"><strong>Тёплый контур — от 5,2 млн ₽</strong><span>Предварительный ориентир. Земля не входит.</span></a>
          <div className="v-actions"><a className="v-button" href="#plan">Смотреть планировку <Arrow /></a><button className="v-button v-outline" onClick={() => openLead("Первый экран — расчёт VELA")}>Получить расчёт</button></div>
        </div>
        <div className="v-shell v-hero-bottom"><dl className="v-facts"><div><dt>Внутри дома</dt><dd>86,2 <small>м²</small></dd></div><div><dt>Крытая терраса</dt><dd>23,1 <small>м²</small></dd></div><div><dt>Спальни</dt><dd>3</dd></div><div><dt>Санузлы</dt><dd>2</dd></div></dl><span className="v-media-note">Архитектурная визуализация</span></div>
      </section>

      <section className="v-section v-shell" id="house" data-section="product">
        <div className="v-heading"><div><p className="v-eyebrow">01 / Дом и планировка</p><h2>Дом для <em>вашего ритма.</em></h2></div><p>Вечер вместе — в кухне-гостиной. Тишина — в отдельных спальнях. Утренний кофе — на террасе.</p></div>
        <div className="v-gallery">
          <figure><button className="v-image-button" onClick={() => showImage(activeImage)} aria-label={`Увеличить изображение: ${gallery[activeImage].label}`}><img src={gallery[activeImage].src} alt={gallery[activeImage].title} loading="lazy" decoding="async" width="1536" height="1024" /><span className="v-enlarge">Увеличить ↗</span></button><figcaption>{gallery[activeImage].caption}</figcaption></figure>
          <div className="v-gallery-copy"><div className="v-pills" aria-label="Виды дома">{gallery.slice(0, 3).map((item, index) => <button key={item.label} aria-pressed={activeImage === index} onClick={() => setActiveImage(index)}>{item.label}</button>)}</div><div aria-live="polite"><h3>{gallery[activeImage].title}</h3><p>{gallery[activeImage].text}</p></div><a className="v-text-link" href="#finance">Выбрать готовность дома <Arrow /></a></div>
        </div>
        <div className="v-plan" id="plan">
          <figure><button className="v-image-button v-technical" onClick={() => showImage(3)} aria-label="Увеличить техническую планировку"><img src={gallery[3].src} alt="Технический план VELA: три спальни, два санузла, кухня-гостиная" loading="lazy" decoding="async" width="1200" height="900" /><span className="v-enlarge">Открыть план ↗</span></button><figcaption>Технический проект · нажмите, чтобы рассмотреть</figcaption></figure>
          <div className="v-plan-copy"><p className="v-eyebrow">Планировка с тремя спальнями</p><h3>Всё на одном этаже.</h3><p>Приватные комнаты отделены от общей зоны. Два санузла помогают спокойно собраться утром.</p><div className="v-plan-metrics"><span><strong>27,3 м²</strong>кухня-гостиная</span><span><strong>86,2 м²</strong>внутри дома</span></div><details className="v-details"><summary>Площади всех помещений</summary><dl className="v-room-list">{rooms.map(([name, area]) => <div key={name}><dt>{name}</dt><dd>{area} м²</dd></div>)}</dl><p>Терраса 23,1 м² и крыльцо 4,5 м² — отдельно от внутренних помещений.</p></details><div className="v-plan-alternative"><strong>Нужны две спальни?</strong><p>Обсудим изменение планировки. Схему и площади согласуем до договора.</p><button className="v-text-link" onClick={() => openLead("Запрос варианта с двумя спальнями", undefined, undefined, "2 спальни — требуется согласование проекта")}>Обсудить вариант <Arrow /></button></div></div>
        </div>
      </section>

      <section className="v-section v-dark" id="finance" data-section="offers"><div className="v-shell">
        <div className="v-heading"><div><p className="v-eyebrow">02 / Комплектации и цена</p><h2>Один дом.<br /><em>Три уровня готовности.</em></h2></div><p>Выберите, в какой момент принять дом: продолжить работы своей командой или получить результат с отделкой.</p></div>
        <div className="v-offers">{offers.map((item, index) => <article className={`v-offer${index === 2 ? " v-featured" : ""}`} key={item.name}><span className="v-offer-number">0{index + 1}{index === 2 && <span>С отделкой</span>}</span><h3>{item.name}</h3><div className="v-offer-price">от {item.price.toFixed(1).replace(".", ",")} <small>млн ₽</small></div><p className="v-price-note">Предварительный ориентир</p><p className="v-offer-result">{item.result}</p><ul>{item.items.map(text => <li key={text}>{text}</li>)}</ul><button className="v-button" onClick={() => openLead(`Расчёт комплектации: ${item.name}`, index)}>Рассчитать {item.short.toLowerCase()} <Arrow /></button></article>)}</div>
        <div className="v-price-boundary"><strong>Что важно учесть в бюджете</strong><p>Земля не входит в цену. Фундамент, подготовка участка, наружные сети и изменения рассчитываются по исходным условиям. Состав, оборудование, доставка, срок и полная стоимость фиксируются в предложении и договоре.</p></div>
        <details className="v-details v-comparison"><summary>Сравнить подробный состав</summary><div className="v-table-scroll" tabIndex={0} role="region" aria-label="Сравнение комплектаций, таблицу можно прокручивать"><table><caption>Границы работ уточняются по спецификации</caption><thead><tr><th scope="col">Работы и материалы</th>{offers.map(o => <th scope="col" key={o.name}>{o.name}</th>)}</tr></thead><tbody>{comparison.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th>{row.slice(1).map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></details>
      </div></section>

      <section className="v-section v-shell" id="land" data-section="purchase">
        <div className="v-heading"><div><p className="v-eyebrow">03 / Участок и покупка</p><h2>Начнём с того,<br /><em>что есть у вас.</em></h2></div><p>Готовый участок или только идея переехать за город — для первого разговора достаточно вашей задачи.</p></div>
        <div className="v-two-cards"><article className="v-card"><span className="v-card-number">01</span><h3>Участок уже есть.</h3><p>Проверим исходные данные, подъезд, рельеф, размещение дома и коммуникации. Кадастровый номер поможет начать предметно.</p><button className="v-text-link" onClick={() => openLead("Проверка участка", undefined, "Есть участок")}>Обсудить мой участок <Arrow /></button></article><article className="v-card"><span className="v-card-number">02</span><h3>Участок ещё ищете.</h3><p>Обсудим район, бюджет и требования к земле. Поможем определить, какие условия нужны для вашего дома.</p><button className="v-text-link" onClick={() => openLead("Помощь с подбором участка", undefined, "Нужна помощь с участком")}>Нужна помощь с участком <Arrow /></button></article></div>
        <div className="v-finance-strip"><div><p className="v-eyebrow">Собственные средства или ипотечный сценарий</p><h3>Проверьте комфортный платёж.</h3><p>Калькулятор считает по вашим параметрам. Без регистрации и заявки.</p></div><button className="v-button v-button-dark" onClick={() => { setCopy("idle"); setModal("calculator"); }}>Рассчитать платёж <Arrow /></button></div>
      </section>

      <section className="v-section v-soft" id="technology" data-section="technology"><div className="v-shell">
        <div className="v-heading"><div><p className="v-eyebrow">04 / Технология</p><h2>За внешним видом —<br /><em>понятная конструкция.</em></h2></div><p>Основание, SIP-конструкции, кровля и инженерия увязываются в одном проекте, до начала работ.</p></div>
        <div className="v-technology"><figure><button className="v-image-button v-technical" onClick={() => showImage(4)} aria-label="Увеличить техническую конструкцию террасы"><img src={gallery[4].src} alt="Техническая модель конструкции дома и террасы" loading="lazy" decoding="async" width="1200" height="900" /><span className="v-enlarge">Рассмотреть конструкцию ↗</span></button><figcaption>{gallery[4].caption}</figcaption></figure><div>
          <details className="v-details" open><summary>Основание — под условия участка</summary><p>Решение по фундаменту принимаем после проверки исходных данных. Оно учитывается в отдельном расчёте, а не подменяется универсальной ценой.</p></details>
          <details className="v-details"><summary>SIP-пол, наружные стены и кровля</summary><p>Состав панелей, соединения и крепёж фиксируются в техническом проекте. Перед закрытием узлов проверяем выполненные работы.</p></details>
          <details className="v-details"><summary>Окна, фасад и крытая терраса</summary><p>Размеры проёмов, материалы, цвет и примыкания согласуем вместе. Терраса показана как часть архитектуры под общей кровлей.</p></details>
          <details className="v-details"><summary>Инженерия и отделка</summary><p>Системы и материалы зависят от выбранной комплектации. Оборудование, трассы и границы монтажа записываем в спецификацию.</p></details>
        </div></div>
      </div></section>

      <section className="v-section v-shell" id="process" data-section="process">
        <div className="v-heading"><div><p className="v-eyebrow">05 / Процесс и ответственность</p><h2>От первого разговора<br /><em>до своих ключей.</em></h2></div><p>Понятно, что согласовано, какой этап идёт сейчас и что предстоит принять.</p></div>
        <ol className="v-steps">{steps.map(([title, text], index) => <li key={title}><span>0{index + 1}</span><strong>{title}</strong><p>{text}</p></li>)}</ol>
        <div className="v-assurance"><article><span>01 / До старта</span><h3>Смета и график.</h3><p>Состав работ и порядок изменений фиксируются до строительства.</p></article><article><span>02 / Во время стройки</span><h3>Приёмка этапов.</h3><p>Проверяем узлы и скрытые работы. Замечания привязываем к конкретному результату.</p></article><article><span>03 / После передачи</span><h3>История дома.</h3><p>Документы, принятые решения и условия гарантии остаются у заказчика.</p></article></div>
        <details className="v-details"><summary>Контроль строительства в ИКИОМА ОС</summary><p>Этапы, документы и фотоотчёты помогают контролировать стройку. Состав доступа заказчика согласуем для проекта. Подключение камеры зависит от питания, связи и условий площадки; непрерывная трансляция не подразумевается автоматически.</p></details>
        <details className="v-details"><summary>Пройдём все регистрации за вас</summary><p>Согласуем сопровождение технического плана, кадастрового учёта и регистрации права. До договора определим три вещи:</p><div className="v-registration"><p><strong>Что делаем мы</strong>Перечень процедур и документов в согласованном сопровождении.</p><p><strong>Где участвуете вы</strong>Исходные документы, подписи и необходимые полномочия собственника.</p><p><strong>Что оплачивается отдельно</strong>Пошлины и услуги третьих лиц — по условиям договора.</p></div><p className="v-note">Объём сопровождения зависит от участка и схемы сделки. Обещание относится к согласованному перечню, а не к любым регистрационным действиям.</p></details>
        <details className="v-details"><summary>Приёмка и гарантийные обязательства</summary><p>Сверяем результат с проектом и спецификацией, фиксируем замечания и их устранение. Срок, объём гарантии, исключения и порядок обращения указываются в вашем договоре.</p></details>
      </section>

      <section className="v-section v-dark" id="team" data-section="evidence"><div className="v-shell">
        <div className="v-heading"><div><p className="v-eyebrow">06 / Проект и команда</p><h2>За каждым этапом —<br /><em>своя ответственность.</em></h2></div><p>Технические решения, сопровождение сделки и работа с заказчиком — части одного проекта.</p></div>
        <div className="v-team-grid"><article><span>Строительство</span><h3>От материалов до приёмки.</h3><p>Закупки, снабжение, подрядчики, инженерия и выполнение работ.</p></article><article><span>Сопровождение сделки</span><h3>От расчёта до документов.</h3><p>Договорные условия, финансовый сценарий и оформление сделки.</p></article><article><span>Продукт и заказчик</span><h3>От выбора до обратной связи.</h3><p>Планировка, комплектация, коммуникация и цифровой учёт проекта.</p></article></div>
        <div className="v-project-strip"><div><span className="v-eyebrow">Коробицино / Технический проект</span><h3>Не только внешний вид.</h3><p>Посмотрите план помещений и конструкцию террасы из проектного альбома.</p></div><div className="v-actions"><button className="v-button v-outline" onClick={() => showImage(3)}>Открыть план <Arrow /></button><button className="v-text-link" onClick={() => showImage(4)}>Конструкция террасы <Arrow /></button></div></div>
      </div></section>

      <section className="v-section v-shell" id="questions" data-section="contact">
        <div className="v-faq"><div><p className="v-eyebrow">07 / Вопросы и следующий шаг</p><h2>Перед решением —<br /><em>всё по делу.</em></h2></div><div>{faq.map(([q, a]) => <details className="v-details" key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></div>
        <div className="v-contact" id="contacts"><div><p className="v-eyebrow">Ваш дом начинается с разговора</p><h2>Рассчитаем VELA<br /><em>под вашу задачу.</em></h2><p>Обсудим участок, планировку и готовность дома. Подготовим предложение с составом работ и границами цены.</p></div><div><button className="v-button" onClick={() => openLead("Финальная заявка — расчёт VELA")}>Получить расчёт дома <Arrow /></button><span className="v-note">Имя и телефон. Остальное — в разговоре.</span></div></div>
      </section>
    </main>

    <footer className="v-footer"><div className="v-shell"><div className="v-footer-top"><a className="v-brand" href="#top" aria-label="ИКИОМА — наверх"><Brand /></a><p>VELA · 86,2 м² внутри · 23,1 м² терраса</p><button className="v-text-link" onClick={() => openLead("Партнёрский запрос — брокер или агент")}>Для партнёров <Arrow /></button></div><div className="v-footer-bottom"><span>© 2026 ИКИОМА</span><p>Цены — предварительные ориентиры, не публичная оферта. Итоговые условия фиксируются в договоре. Визуализации не заменяют проект и спецификацию.</p><a href="#top">Наверх ↑</a></div></div></footer>

    {sticky && !modal && <div className="v-sticky"><span>ИКИОМА <strong>VELA</strong></span><button className="v-button v-button-small" onClick={() => openLead("Мобильная панель — расчёт VELA")}>Получить расчёт <Arrow /></button></div>}

    <dialog ref={dialog} className={`v-dialog${modal === "gallery" ? " v-dialog-gallery" : ""}${modal === "menu" ? " v-dialog-menu" : ""}`} aria-labelledby="v-dialog-title" onCancel={(e) => { e.preventDefault(); setModal(null); }} onClose={() => setModal(null)} onClick={(e) => { if (e.target !== e.currentTarget) return; const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) setModal(null); }}>
      <button type="button" className="v-close" onClick={() => setModal(null)} aria-label="Закрыть окно"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg></button>
      {modal === "menu" && <div className="v-dialog-body"><h2 id="v-dialog-title">ИКИОМА</h2><nav aria-label="Мобильная навигация">{nav.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setModal(null)}>{label}<Arrow /></a>)}</nav><button className="v-button" onClick={() => openLead("Мобильное меню")}>Получить расчёт <Arrow /></button></div>}
      {modal === "gallery" && <div className="v-lightbox"><h2 id="v-dialog-title">{gallery[expandedImage].title}</h2><img src={gallery[expandedImage].src} alt={gallery[expandedImage].title} /><p>{gallery[expandedImage].caption}</p><div className="v-pills" aria-label="Изображения дома">{gallery.map((item, index) => <button key={item.label} aria-pressed={index === expandedImage} onClick={() => setExpandedImage(index)}>{item.label}</button>)}</div></div>}
      {modal === "lead" && <div className="v-dialog-body">{status === "sent" ? <div className="v-success" role="status"><span className="v-success-mark" aria-hidden="true">✓</span><p className="v-eyebrow">Заявка получена</p><h2 id="v-dialog-title">Спасибо, {form.name}.</h2><p>Свяжемся по указанному телефону, чтобы обсудить ваш дом и участок.</p><button className="v-button v-button-dark" onClick={() => setModal(null)}>Вернуться на сайт</button></div> : <form onSubmit={submit} aria-busy={status === "sending"}><p className="v-eyebrow">ИКИОМА / VELA</p><h2 id="v-dialog-title">Дом под вашу задачу.</h2><p className="v-form-intro">Оставьте контакты. Выбранную комплектацию и пожелания передадим вместе с заявкой.</p><fieldset disabled={status === "sending"} className="v-form-fields"><label>Как к вам обращаться<input name="name" required maxLength={100} autoComplete="name" placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label><label>Телефон<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" maxLength={30} placeholder="+7 999 123-45-67" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label><label>Комплектация<select value={offer} onChange={e => setOffer(Number(e.target.value))}>{offers.map((item, index) => <option value={index} key={item.name}>{item.name}</option>)}</select></label><label>Участок<select value={land} onChange={e => setLand(e.target.value)}><option>Пока не определился</option><option>Есть участок</option><option>Выбираю самостоятельно</option><option>Нужна помощь с участком</option></select></label><details className="v-details v-form-extra"><summary>Добавить пожелания</summary><label>Планировка<select value={layout} onChange={e => setLayout(e.target.value)}><option>3 спальни</option><option>2 спальни — требуется согласование проекта</option></select></label><label>Комментарий<textarea rows={3} maxLength={2000} placeholder="Район, бюджет, желаемая дата начала" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></label><p className="v-note">{context}</p></details><label className="v-honeypot" aria-hidden="true">Компания<input autoComplete="off" tabIndex={-1} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label><label className="v-consent"><input type="checkbox" required checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })} /><span>Согласен на обработку имени, телефона и переданных пожеланий для ответа на эту заявку.</span></label></fieldset>{status === "error" && <p className="v-error" role="alert">{error}</p>}<button type="submit" disabled={status === "sending"} className="v-button v-submit">{status === "sending" ? "Отправляем…" : "Отправить заявку"}<Arrow /></button><p className="v-note">Контакты нужны для обсуждения дома. Согласие на рекламную рассылку здесь не запрашивается.</p></form>}</div>}
      {modal === "calculator" && <div className="v-dialog-body"><p className="v-eyebrow">Математический сценарий</p><h2 id="v-dialog-title">Платёж под ваш бюджет.</h2><p className="v-form-intro">Задайте параметры. Это не предложение банка и не подтверждение доступности ипотеки.</p><div className="v-calc"><div className="v-calc-controls"><label><span>Стоимость дома <strong>{price.toFixed(1).replace(".", ",")} млн ₽</strong></span><input aria-label="Стоимость дома в миллионах рублей" type="range" min="5.2" max="14" step="0.1" value={price} onChange={e => { setPrice(Number(e.target.value)); setCopy("idle"); }} /></label><label><span>Первоначальный взнос <strong>{down}%</strong></span><input aria-label="Первоначальный взнос в процентах" type="range" min="0" max="100" step="5" value={down} onChange={e => { setDown(Number(e.target.value)); setCopy("idle"); }} /></label><div className="v-calc-selects"><label>Условная ставка, %<input type="number" min="0" max="100" step="0.1" value={rate} onChange={e => { setRate(Math.max(0, Math.min(100, Number(e.target.value) || 0))); setCopy("idle"); }} /></label><label>Срок<select value={years} onChange={e => { setYears(Number(e.target.value)); setCopy("idle"); }}>{[5, 10, 15, 20, 25, 30].map(year => <option key={year} value={year}>{year} лет</option>)}</select></label></div></div><div className="v-calc-result" aria-live="polite"><span>Ориентировочный платёж</span><strong>≈ {money(monthly)} ₽<small>/мес</small></strong><dl><div><dt>Ваш взнос</dt><dd>{money(total - loan)} ₽</dd></div><div><dt>Финансирование</dt><dd>{money(loan)} ₽</dd></div></dl><button className="v-button v-button-dark" onClick={() => openLead(scenario)}>Обсудить этот сценарий <Arrow /></button><button className="v-text-link" onClick={async () => { try { await navigator.clipboard.writeText(scenario); setCopy("copied"); } catch { setCopy("manual"); } }}>{copy === "copied" ? "Расчёт скопирован" : "Скопировать расчёт"}</button></div></div>{copy === "manual" && <label className="v-copy-fallback">Выделите и скопируйте расчёт<textarea readOnly value={scenario} rows={4} onFocus={e => e.target.select()} /></label>}<p className="v-note">Аннуитетный расчёт без страховок, комиссий и стоимости участка. Ставка и взнос — параметры примера, не действующая банковская программа. Доступность и условия финансирования проверяются отдельно.</p></div>}
    </dialog>
  </div>;
}
