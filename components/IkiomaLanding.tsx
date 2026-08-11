"use client";

/* eslint-disable @next/next/no-img-element -- local product imagery is optimized WebP */

import { useEffect, useMemo, useState, type FormEvent } from "react";

const houseOptions = [
  {
    id: "layout",
    label: "Планировка",
    title: "Три спальни. Два санузла. Всё на одном этаже.",
    text: "Это план из актуального технического проекта: 86,2 м² полезной площади внутри и крытая терраса 23,1 м². Вход ведёт через тамбур и холл, приватные комнаты отделены от кухни-гостиной.",
    image: "/images/kontur-plan.jpg",
    alt: "Технический план одноэтажного дома КОНТУР",
    caption: "Фактический проект / лист с планировкой и экспликацией",
    fixed: "Состав и размеры помещений, проёмы, маршруты, сантехнические зоны и выход на террасу.",
  },
  {
    id: "windows",
    label: "Окна",
    title: "Свет там, где он работает на дом.",
    text: "Размеры и расположение окон связываем с планировкой, фасадом и ориентацией дома на участке — до фиксации итогового расчёта.",
    image: "/images/option-windows.webp",
    alt: "Специалист проверяет панорамную оконную группу дома",
    caption: "Визуализация / размер, профиль и тип открывания",
    fixed: "Размеры, расположение, профиль, стеклопакет, тип открывания и цвет рам.",
  },
  {
    id: "facade",
    label: "Фасад",
    title: "Спокойная архитектура, понятные материалы.",
    text: "Цвет, фактуру и сочетания материалов выбираем как одну систему. Состав и объём фасадных работ указываются в коммерческом предложении.",
    image: "/images/option-facade.webp",
    alt: "Сочетание графитового металла и дерева на фасаде дома",
    caption: "Визуализация / металл, дерево, цвет и фактура",
    fixed: "Материал, цвет, фактуру, долю дерева и ключевые узлы примыканий.",
  },
  {
    id: "engineering",
    label: "Инженерия",
    title: "Сначала схема, затем монтаж.",
    text: "Инженерные решения увязываем с домом и условиями участка. Конкретный набор систем, оборудование и границы работ появляются в расчёте.",
    image: "/images/option-engineering.webp",
    alt: "Монтаж тёплого пола и инженерных систем внутри дома",
    caption: "Иллюстрация / системы, трассы и оборудование",
    fixed: "Перечень систем, оборудование, точки подключения, трассы и границы монтажа.",
  },
  {
    id: "finishing",
    label: "Отделка",
    title: "Дом может закончиться там, где удобно вам.",
    text: "Уровень готовности выбирается до договора: от согласованного контура до варианта с отделкой. Без размытых формулировок «почти под ключ».",
    image: "/images/kontur-family-interior-v1.webp",
    alt: "Сгенерированная визуализация семейной кухни-гостиной дома КОНТУР",
    caption: "Временная AI-визуализация / материалы и уровень готовности",
    fixed: "Пол, стены, потолок, двери, санузлы и точный уровень готовности к заселению.",
  },
] as const;

const houseTour = [
  {
    id: "exterior",
    label: "Внешний вид",
    title: "КОНТУР с крытой террасой под общей кровлей",
    text: "Спокойная одноэтажная архитектура, графитовый фасад и тёплое дерево в зоне входа и террасы.",
    image: "/images/kontur-family-exterior-v1.webp",
    alt: "Сгенерированная визуализация семьи у одноэтажного дома КОНТУР",
    caption: "Временная AI-визуализация семейного сценария",
  },
  {
    id: "layout",
    label: "Планировка",
    title: "86,2 м² полезной площади — без площади ради площади",
    text: "Три спальни, два санузла, кухня-гостиная 27,3 м², входная группа и прямой выход на крытую террасу. Это лист из актуального проекта, а не условный пример.",
    image: "/images/kontur-plan.jpg",
    alt: "Техническая планировка дома КОНТУР",
    caption: "Технический проект / план этажа",
  },
  {
    id: "interior",
    label: "Внутри",
    title: "Общая зона раскрывается в сторону участка",
    text: "Кухня-гостиная, естественный свет и прямой выход на крытую террасу — главный повседневный сценарий дома.",
    image: "/images/kontur-family-interior-v1.webp",
    alt: "Сгенерированная визуализация семьи в кухне-гостиной дома КОНТУР",
    caption: "Временная AI-визуализация интерьера",
  },
  {
    id: "terrace",
    label: "Терраса",
    title: "23,1 м² под общей кровлей",
    text: "По проекту терраса имеет ширину около трёх метров, примыкает к кухне-гостиной и защищена продолжением кровли. В маркетинговой характеристике площадь округлена до 24 м².",
    image: "/images/kontur-covered-terrace-v1.webp",
    alt: "Сгенерированная визуализация семьи на крытой террасе дома КОНТУР",
    caption: "Временная AI-визуализация жизни на террасе",
  },
  {
    id: "terrace-structure",
    label: "Конструкция",
    title: "Терраса — часть архитектуры дома",
    text: "Техническая модель показывает продолжение общей кровли, опоры, свайное основание и примыкание террасы к остальному контуру дома.",
    image: "/images/kontur-terrace-technical.jpg",
    alt: "Техническая модель конструкции крытой террасы дома КОНТУР",
    caption: "Технический проект / конструкция террасы",
  },
] as const;

const planRooms = [
  ["Кухня-гостиная", "27,3 м²"],
  ["Спальня 1", "14,4 м²"],
  ["Спальня 2", "12,4 м²"],
  ["Спальня 3", "11,0 м²"],
  ["Входная зона", "7,5 м²"],
  ["Санузел 1", "5,5 м²"],
  ["Холл", "4,2 м²"],
  ["Санузел 2", "3,9 м²"],
  ["Крытая терраса", "23,1 м²"],
  ["Крыльцо", "4,5 м²"],
] as const;

const buildOffers = [
  {
    id: "shell",
    label: "01 / Тёплый контур",
    price: 5.2,
    term: "до 8 недель",
    description: "SIP-контур, кровля, окна и закрытый фасад.",
    includes: ["SIP-пол, наружные стены и кровля", "внутренние каркасные перегородки", "оконные блоки", "кровельное покрытие и закрытый фасад"],
  },
  {
    id: "pre-finish",
    label: "02 / Под отделку",
    price: 6.3,
    term: "до 12 недель",
    description: "Тёплый контур плюс согласованная инженерия и подготовка поверхностей.",
    includes: ["весь состав тёплого контура", "согласованные инженерные системы", "подготовка поверхностей под финиш", "точки подключения и границы монтажа по проекту"],
  },
  {
    id: "ready",
    label: "03 / Готовый дом",
    price: 7.2,
    term: "до 4 месяцев",
    description: "Дом с отделкой, инженерией и готовностью к передаче ключей.",
    includes: ["весь состав варианта под отделку", "согласованные чистовые материалы", "двери, санузлы и финишные покрытия", "приёмка и передача документов по дому"],
  },
] as const;

const scheduleItems = [
  { label: "Сделка по участку и договор участия", period: "10.08", start: 0, duration: 1, milestone: true },
  { label: "Подготовка и выравнивание участка", period: "10–25.08", start: 0, duration: 16 },
  { label: "Основные договоры и поставки", period: "10–25.08", start: 0, duration: 16 },
  { label: "Железобетонный свайный фундамент", period: "10–15.08", start: 0, duration: 6 },
  { label: "Поставка пиломатериалов и крепежа", period: "10–15.08", start: 0, duration: 6 },
  { label: "Обвязка свайного поля", period: "14–16.08", start: 4, duration: 3 },
  { label: "Монтаж SIP-пола на отметке 0", period: "16–20.08", start: 6, duration: 5 },
  { label: "Наружные стены и перегородки", period: "20–27.08", start: 10, duration: 8 },
  { label: "Поставка профлиста для кровли и фасада", period: "25–27.08", start: 15, duration: 3 },
  { label: "Монтаж перекрытия и SIP-кровли", period: "27.08–10.09", start: 17, duration: 15 },
  { label: "Монтаж окон ПВХ", period: "27.08–10.09", start: 17, duration: 15 },
  { label: "Утепление внутренних перегородок", period: "27.08–10.09", start: 17, duration: 15 },
] as const;

const buildStages = [
  {
    number: "01",
    title: "Заявка",
    text: "Фиксируем задачу: состав семьи, участок, желаемый уровень готовности и финансовый сценарий.",
    image: "/images/stage-request.webp",
    alt: "Семья обсуждает будущий дом с архитектором",
  },
  {
    number: "02",
    title: "Участок",
    text: "Если участок есть — проверяем подъезд, пятно застройки, рельеф и сети. Если участка нет — помогаем сформировать требования и подобрать подходящие варианты.",
    image: "/images/stage-site.webp",
    alt: "Инженер проводит обследование и разметку участка",
  },
  {
    number: "03",
    title: "Расчёт",
    text: "Собираем дом, комплектацию и работы в один прозрачный расчёт. Отдельно показываем переменные участка.",
    image: "/images/stage-calculation.webp",
    alt: "Смета, калькулятор и материалы для расчёта дома",
  },
  {
    number: "04",
    title: "Договор",
    text: "Фиксируем выбранную комплектацию, состав работ, этапы, срок и порядок приёмки.",
    image: "/images/stage-contract.webp",
    alt: "Заказчики и руководитель проекта подписывают договор",
  },
  {
    number: "05",
    title: "Стройка",
    text: "Строим по зафиксированному графику. Каждый этап проверяем и сохраняем в фотоистории проекта.",
    image: "/images/sip-assembly.webp",
    alt: "Монтаж SIP-панелей дома КОНТУР",
  },
  {
    number: "06",
    title: "Приёмка",
    text: "Вместе осматриваем готовый дом по чек-листу. Замечания фиксируем и закрываем до передачи результата.",
    image: "/images/stage-acceptance.webp",
    alt: "Заказчик и специалист принимают готовый дом",
  },
  {
    number: "07",
    title: "Ключи",
    text: "Передаём готовый результат, документы и цифровую историю дома для гарантии и дальнейшего сервиса.",
    image: "/images/stage-keys.webp",
    alt: "Передача ключей владельцу готового дома",
  },
] as const;

const faqItems = [
  {
    question: "Почему дом называется «КОНТУР» и откуда 120 м²?",
    answer:
      "«КОНТУР» — имя модели. 120 м² — не название, а общая площадь застройки: внешний контур дома 96 м² плюс крытая терраса около 24 м². Полезная площадь помещений по проекту — 86,2 м².",
  },
  {
    question: "Это реальная планировка или пример?",
    answer:
      "На сайте показан план из актуального технического альбома АРО-96 для проекта в Коробицино: три спальни, два санузла, кухня-гостиная и терраса. АРО-96 — рабочее название проектного альбома; на сайте модель называется «КОНТУР».",
  },
  {
    question: "Можно обратиться без участка?",
    answer:
      "Да. Если участок уже есть, проверим его и посадим дом. Если участка нет, поможем определить требования и подобрать варианты. Цена земли и сделка по её покупке не входят в стоимость дома и считаются отдельно.",
  },
  {
    question: "Когда появляется точная цена и срок?",
    answer:
      "На сайте виден ориентир комплектаций — от 5,2 до 7,2 млн ₽. Точные цена, состав и календарный график фиксируются после проверки участка, проекта и выбранного уровня готовности. Основание, наружные сети и изменения показываются отдельно.",
  },
  {
    question: "Можно ли изменить дом КОНТУР?",
    answer:
      "Можно согласовать отдельные решения по планировке, окнам, фасаду, инженерии и отделке. Изменения считаются до фиксации проекта, чтобы стройка не превращалась в цепочку неожиданных доплат.",
  },
  {
    question: "Как контролировать стройку дистанционно?",
    answer:
      "Проект предусматривает онлайн-видео, фиксацию этапов, документы и вопросы по ходу работ в одном цифровом контуре. Следующий этап начинается после приёмки предыдущего.",
  },
  {
    question: "Что означает гарантия 5 лет?",
    answer:
      "Гарантийные обязательства привязываются к договору и цифровой истории дома. Точный объём, исключения и порядок обращения фиксируются в документах конкретного проекта.",
  },
] as const;

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 4l12 12M16 4 4 16" />
    </svg>
  );
}

function monthlyPayment(principal: number, annualRate: number, years: number) {
  const months = years * 12;
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const rate = annualRate / 100 / 12;
  const factor = Math.pow(1 + rate, months);
  return (principal * rate * factor) / (factor - 1);
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export default function IkiomaLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [activeTour, setActiveTour] = useState(0);
  const [leadContext, setLeadContext] = useState("Дом КОНТУР — готовый дом");
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [leadForm, setLeadForm] = useState({ name: "", phone: "", email: "", land: "Есть участок", comment: "", company: "" });
  const [housePrice, setHousePrice] = useState(7.2);
  const [downPayment, setDownPayment] = useState(20);
  const [term, setTerm] = useState(30);
  const [rate, setRate] = useState(6);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [manualText, setManualText] = useState("");
  const [activeOption, setActiveOption] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const calculation = useMemo(() => {
    const total = housePrice * 1_000_000;
    const down = total * (downPayment / 100);
    const loan = total - down;
    const payment = monthlyPayment(loan, rate, term);
    return { total, down, loan, payment };
  }, [housePrice, downPayment, rate, term]);

  useEffect(() => {
    document.body.style.overflow = menuOpen || calculatorOpen || tourOpen || leadOpen ? "hidden" : "";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCalculatorOpen(false);
        setTourOpen(false);
        setLeadOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [calculatorOpen, leadOpen, menuOpen, tourOpen]);

  function openLead(context: string) {
    setLeadContext(context);
    setLeadStatus("idle");
    setCalculatorOpen(false);
    setTourOpen(false);
    setLeadOpen(true);
  }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim() || leadForm.company) return;
    setLeadStatus("sending");

    const message = [
      leadContext,
      `Участок: ${leadForm.land}`,
      leadForm.comment.trim() ? `Комментарий: ${leadForm.comment.trim()}` : "",
    ].filter(Boolean).join("\n");

    try {
      const response = await fetch("https://ikioma-telegram-gateway.ozolin.chatgpt.site/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: leadForm.phone.trim(),
          email: leadForm.email.trim(),
          source: "website",
          message,
          website: "ikioma.ru",
        }),
      });
      if (!response.ok) throw new Error("lead_rejected");
      setLeadStatus("sent");
    } catch {
      setLeadStatus("error");
    }
  }

  async function copyCalculation() {
    const text = [
      "Предварительный сценарий ИКИОМА",
      `Стоимость дома: ${formatMoney(calculation.total)} ₽`,
      `Первоначальный взнос: ${formatMoney(calculation.down)} ₽ (${downPayment}%)`,
      `Сумма финансирования: ${formatMoney(calculation.loan)} ₽`,
      `Ставка: ${rate}%`,
      `Срок: ${term} лет`,
      `Ориентировочный платёж: ${formatMoney(calculation.payment)} ₽/мес`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 1800);
    } catch {
      setManualText(text);
      setCopyStatus("manual");
    }
  }

  return (
    <main>
      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="ИКИОМА — на главную">
            <img src="/images/logo.webp" alt="" aria-hidden="true" />
            <span>
              <strong>ИКИОМА</strong>
              <small>Дома из SIP-панелей</small>
            </span>
          </a>

          <nav className={menuOpen ? "nav open" : "nav"} aria-label="Основная навигация">
            <a href="#house" onClick={() => setMenuOpen(false)}>
              Дом
            </a>
            <a href="#plan" onClick={() => setMenuOpen(false)}>
              Планировка
            </a>
            <a href="#process" onClick={() => setMenuOpen(false)}>
              Стройка
            </a>
            <a href="#finance" onClick={() => setMenuOpen(false)}>
              Цена
            </a>
          </nav>

          <button className="header-cta" onClick={() => openLead("Заявка из шапки сайта") }>
            Оставить заявку
          </button>

          <button
            className={menuOpen ? "menu-toggle active" : "menu-toggle"}
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <img
          className="hero-image"
          src="/images/kontur-family-exterior-v1.webp"
          alt="Сгенерированная визуализация семьи с детьми у одноэтажного дома КОНТУР"
        />
        <div className="hero-shade" />
        <span className="hero-media-label">Временная AI-визуализация</span>
        <div className="shell hero-content">
          <div className="hero-copy">
            <h1>
              <span>Дом КОНТУР.</span>
              <em>По-настоящему свой.</em>
            </h1>
            <p className="hero-lead">
              Три спальни, два санузла, кухня-гостиная и крытая терраса.
              120 м² площади застройки: 96 м² дом и 24 м² терраса.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => openLead("Дом КОНТУР — расчёт под участок") }>
                Получить предложение
                <ArrowIcon />
              </button>
              <button className="hero-scroll-link" onClick={() => setTourOpen(true)}>
                Посмотреть дом
                <ArrowIcon />
              </button>
            </div>
            <p className="micro-note">
              Готовый дом — от 7,2 млн ₽. Стоимость участка в цену не входит.
            </p>
          </div>

          <aside className="hero-card" aria-label="Кратко о доме КОНТУР">
            <div className="hero-card-top">
              <span>Первый дом ИКИОМА</span>
              <i>01</i>
            </div>
            <strong>КОНТУР</strong>
            <p>Простая геометрия, тёплая архитектура и крытая терраса под общей кровлей.</p>
            <dl>
              <div>
                <dt>Внутри</dt>
                <dd>86,2 м²</dd>
              </div>
              <div>
                <dt>Спальни</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Санузлы</dt>
                <dd>2</dd>
              </div>
            </dl>
            <button onClick={() => setTourOpen(true)}>
              Открыть карточку дома
              <ArrowIcon />
            </button>
          </aside>
        </div>

        <div className="shell hero-stats" aria-label="Главные факты об ИКИОМА">
          <div>
            <strong>120 м²</strong>
            <span>общая площадь застройки</span>
          </div>
          <div>
            <strong>86,2 м²</strong>
            <span>полезная площадь внутри</span>
          </div>
          <div>
            <strong>23,1 м²</strong>
            <span>терраса по проекту</span>
          </div>
          <div>
            <strong>3 + 2</strong>
            <span>спальни и санузлы</span>
          </div>
        </div>
      </section>

      <section className="house-intro shell" id="house">
        <div className="house-intro-copy">
          <span className="section-index">01 / Дом КОНТУР</span>
          <h2>
            Не каталог обещаний.
            <br />
            <em>Один дом — до каждой детали.</em>
          </h2>
          <p>
            КОНТУР — имя дома. Число 120 больше не маскируется под название:
            это 96 м² внешнего контура дома плюс около 24 м² крытой террасы.
            Полезная площадь помещений по актуальному проекту — 86,2 м².
          </p>
          <ul className="house-facts" aria-label="Характеристики дома КОНТУР">
            <li><strong>96 + 24 м²</strong><span>площадь застройки</span></li>
            <li><strong>86,2 м²</strong><span>полезная площадь</span></li>
            <li><strong>1 этаж</strong><span>для семьи без лестниц</span></li>
          </ul>
          <button className="text-link" onClick={() => setTourOpen(true)}>
            Смотреть дом полностью
            <ArrowIcon />
          </button>
        </div>
        <figure className="house-intro-image">
          <img src="/images/house-day.webp" alt="Визуализация дома КОНТУР днём" />
          <figcaption>Архитектурная визуализация концепции дома КОНТУР</figcaption>
        </figure>
      </section>

      <section className="plan-section" id="plan">
        <div className="shell plan-head">
          <div>
            <span className="section-index">02 / Актуальная планировка</span>
            <h2>
              Видно, где вход.
              <br />
              <em>И как живёт дом.</em>
            </h2>
          </div>
          <p>
            Это не типовая картинка из каталога. План взят из технического альбома
            АРО-96 для проекта в Коробицино. АРО-96 — рабочее название альбома;
            КОНТУР — название модели на сайте.
          </p>
        </div>

        <div className="shell plan-grid">
          <figure className="plan-drawing">
            <a href="/images/kontur-plan.jpg" target="_blank" rel="noreferrer" aria-label="Открыть техническую планировку в полном размере">
              <img src="/images/kontur-plan.jpg" alt="Техническая планировка дома КОНТУР с экспликацией помещений" />
            </a>
            <figcaption>
              Технический проект АРО-96 · лист 9 · нажмите, чтобы увеличить
            </figcaption>
          </figure>

          <div className="plan-copy">
            <span>Маршрут по дому</span>
            <p className="plan-route" aria-label="Маршрут от входа к террасе">
              Крыльцо <i>→</i> входная зона <i>→</i> холл <i>→</i> кухня-гостиная <i>→</i> терраса
            </p>
            <h3>Состав помещений</h3>
            <dl className="room-list">
              {planRooms.map(([room, area]) => (
                <div key={room}>
                  <dt>{room}</dt>
                  <dd>{area}</dd>
                </div>
              ))}
            </dl>
            <p className="plan-note">
              Внутренние помещения — 86,2 м². Терраса и крыльцо учитываются отдельно.
            </p>
          </div>
        </div>
      </section>

      <section className="land-section" id="land">
        <div className="shell land-head">
          <div>
            <span className="section-index light">03 / Участок</span>
            <h2>
              С участком.
              <br />
              <em>Или пока без него.</em>
            </h2>
          </div>
          <p>
            Дом строим на вашем участке, а если земли ещё нет — помогаем сформировать
            требования и подобрать подходящие варианты. Земля не включена в цену дома.
          </p>
        </div>
        <div className="shell land-grid">
          <article>
            <span>Участок уже есть</span>
            <strong>Проверим до расчёта.</strong>
            <p>Смотрим подъезд, пятно застройки, рельеф, посадку дома и точки подключения. После этого фиксируем решение по основанию и наружным сетям.</p>
            <button className="text-button light-link" onClick={() => openLead("Дом КОНТУР — участок уже есть") }>
              Проверить мой участок <ArrowIcon />
            </button>
          </article>
          <article>
            <span>Участка пока нет</span>
            <strong>Поможем с подбором.</strong>
            <p>Определим район, бюджет, коммуникации и ограничения, затем соберём подходящие варианты. Покупка земли и расходы по сделке считаются отдельно.</p>
            <button className="text-button light-link" onClick={() => openLead("Дом КОНТУР — нужна помощь с участком") }>
              Начать подбор <ArrowIcon />
            </button>
          </article>
        </div>
        <p className="shell land-disclaimer">Цены 5,2–7,2 млн ₽ ниже относятся к дому в выбранной комплектации. Стоимость земли в них не входит.</p>
        <div className="shell life-strip">
          <figure>
            <img src="/images/kontur-covered-terrace-v1.webp" alt="Сгенерированная визуализация семьи на крытой террасе дома КОНТУР" />
            <figcaption>Временная AI-визуализация · не фотография построенного объекта</figcaption>
          </figure>
          <div>
            <span>За пределами сметы</span>
            <h3>Здесь начинается жизнь за городом.</h3>
            <p>
              Не только стены и срок стройки: завтрак на крытой террасе, детские
              комнаты рядом, один этаж без лестниц и общая кухня-гостиная, где семья собирается вечером.
            </p>
            <ul>
              <li>три отдельные спальни;</li>
              <li>два санузла для утреннего ритма семьи;</li>
              <li>прямой выход из общей зоны на террасу.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="configuration-section">
        <div className="shell configuration-head">
          <div>
            <span className="section-index">04 / Варианты</span>
            <h2>
              Дом узнаваемый.
              <br />
              <em>Решения — ваши.</em>
            </h2>
          </div>
          <p>
            Не переделываем КОНТУР до неузнаваемости. Настраиваем то, что влияет
            на жизнь, внешний вид и уровень готовности — и считаем до начала работ.
          </p>
        </div>

        <div className="shell configuration-tabs" role="tablist" aria-label="Варианты дома">
          {houseOptions.map((option, index) => (
            <button
              key={option.id}
              className={activeOption === index ? "active" : ""}
              onClick={() => setActiveOption(index)}
              role="tab"
              aria-selected={activeOption === index}
              aria-controls={`option-panel-${option.id}`}
            >
              <span>0{index + 1}</span>
              {option.label}
            </button>
          ))}
        </div>

        <div
          className="shell configuration-panel"
          id={`option-panel-${houseOptions[activeOption].id}`}
          role="tabpanel"
        >
          <figure className={houseOptions[activeOption].id === "layout" ? "technical" : ""}>
            <img
              src={houseOptions[activeOption].image}
              alt={houseOptions[activeOption].alt}
            />
            <figcaption>{houseOptions[activeOption].caption}</figcaption>
          </figure>
          <div className="configuration-copy">
            <span>0{activeOption + 1}</span>
            <h3>{houseOptions[activeOption].title}</h3>
            <p>{houseOptions[activeOption].text}</p>
            <div className="configuration-note">
              <strong>Что фиксируем</strong>
              <p>{houseOptions[activeOption].fixed}</p>
            </div>
            <button className="text-button" onClick={() => openLead(`Дом КОНТУР — ${houseOptions[activeOption].label}`)}>
              Получить расчёт этого решения
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="shell process-head">
          <div>
            <span className="section-index light">05 / Как строим</span>
            <h2>
              Семь этапов.
              <br />
              <em>Ни одного прыжка вслепую.</em>
            </h2>
          </div>
          <p>
            Каждый следующий шаг начинается после того, как понятен результат
            предыдущего. Поэтому цена, срок и ответственность не живут отдельной
            жизнью.
          </p>
        </div>

        <div className="shell stage-tabs" role="tablist" aria-label="Этапы строительства">
          {buildStages.map((stage, index) => (
            <button
              key={stage.number}
              className={activeStage === index ? "active" : ""}
              onClick={() => setActiveStage(index)}
              role="tab"
              aria-selected={activeStage === index}
              aria-controls={`stage-${stage.number}`}
            >
              <span>{stage.number}</span>
              <strong>{stage.title}</strong>
            </button>
          ))}
        </div>

        <div
          className="shell stage-panel"
          id={`stage-${buildStages[activeStage].number}`}
          role="tabpanel"
        >
          <figure>
            <img src={buildStages[activeStage].image} alt={buildStages[activeStage].alt} />
            <figcaption>
              Этап {buildStages[activeStage].number} из 07
            </figcaption>
          </figure>
          <div className="stage-copy">
            <span>{buildStages[activeStage].number}</span>
            <h3>{buildStages[activeStage].title}</h3>
            <p>{buildStages[activeStage].text}</p>
            <div className="stage-progress" aria-hidden="true">
              <i style={{ width: `${((activeStage + 1) / buildStages.length) * 100}%` }} />
            </div>
            <small>
              {activeStage + 1} / {buildStages.length}
            </small>
          </div>
        </div>
      </section>

      <section className="schedule-section" id="schedule">
        <div className="shell schedule-head">
          <div>
            <span className="section-index">06 / ППР проекта</span>
            <h2>
              Не «примерно месяц».
              <br />
              <em>Работы по датам.</em>
            </h2>
          </div>
          <div className="schedule-summary">
            <strong>10 августа — 10 сентября 2026</strong>
            <p>Пример календарного плана тёплого контура для проекта в Коробицино.</p>
          </div>
        </div>

        <div className="shell gantt-card">
          <div className="gantt-axis" aria-hidden="true">
            <span>10.08</span>
            <span>16.08</span>
            <span>22.08</span>
            <span>28.08</span>
            <span>04.09</span>
            <span>10.09</span>
          </div>
          <div className="gantt-chart" role="img" aria-label="Диаграмма Ганта работ с 10 августа по 10 сентября 2026 года">
            {scheduleItems.map((item) => (
              <div className="gantt-row" key={item.label}>
                <div className="gantt-label">
                  <span>{item.label}</span>
                  <small>{item.period}</small>
                </div>
                <div className="gantt-track">
                  <i
                    className={"milestone" in item && item.milestone ? "milestone" : ""}
                    style={{
                      left: `${(item.start / 32) * 100}%`,
                      width: `${Math.max((item.duration / 32) * 100, 2.8)}%`,
                    }}
                  >
                    <span>{item.period}</span>
                  </i>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="shell schedule-note">
          График перенесён из ППР проекта. Для нового дома даты фиксируются после проверки участка,
          готовности проекта, основания и поставок; параллельные работы могут идти одновременно.
        </p>
      </section>

      <section className="control-section shell" id="control">
        <div className="control-image">
          <img src="/images/site.webp" alt="Строительная площадка ИКИОМА с готовым домом" />
          <div className="control-stamp">
            <strong>24/7</strong>
            <span>видимый процесс</span>
          </div>
        </div>
        <div className="control-copy">
          <span className="section-index">07 / Контроль</span>
          <h2>
            Следующий этап —
            <br />
            <em>только после приёмки.</em>
          </h2>
          <p>
            Геометрия, узлы и скрытые работы проверяются тогда, когда их ещё можно
            увидеть. Результат фиксируется, а вопросы не откладываются до передачи
            ключей.
          </p>
          <ul>
            <li>
              <span>01</span>
              Проверка результата этапа
            </li>
            <li>
              <span>02</span>
              Фото- и видеофиксация
            </li>
            <li>
              <span>03</span>
              Переход дальше после приёмки
            </li>
          </ul>
        </div>
      </section>

      <section className="digital-section">
        <div className="shell">
          <div className="digital-head">
            <span className="section-index">08 / Цифровой контур</span>
            <h2>
              Стройка остаётся
              <br />
              <em>видимой.</em>
            </h2>
            <p>
              Без имитации «умного кабинета» на лендинге. В проекте важны четыре
              реальные функции, которые помогают принимать дом по фактам.
            </p>
          </div>
          <div className="digital-grid">
            <article>
              <span>01</span>
              <strong>Онлайн-видео 24/7</strong>
              <p>Можно увидеть, что происходит на площадке, даже если вы далеко.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Прогресс по этапам</strong>
              <p>Понятно, где находится стройка и какой результат принимается сейчас.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Документы проекта</strong>
              <p>Согласованные материалы и история решений не теряются в переписках.</p>
            </article>
            <article>
              <span>04</span>
              <strong>Вопросы по ходу работ</strong>
              <p>Замечание привязано к этапу и получает видимый статус решения.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="finance-section" id="finance">
        <div className="shell finance-head">
          <div>
            <span className="section-index light">09 / Цена и готовность</span>
            <h2>
              Три уровня готовности.
              <br />
              <em>Цена видна сразу.</em>
            </h2>
          </div>
          <p>
            Один дом КОНТУР, но разная точка остановки. Выберите, где заканчивается
            наша работа — на тёплом контуре, подготовке под отделку или передаче ключей.
          </p>
        </div>

        <div className="shell offer-grid" aria-label="Варианты готовности дома КОНТУР">
          {buildOffers.map((offer) => (
            <article className={offer.id === "ready" ? "offer-card featured" : "offer-card"} key={offer.id}>
              <span>{offer.label}</span>
              <strong>от {offer.price.toFixed(1).replace(".", ",")} млн ₽</strong>
              <small>{offer.term}</small>
              <p>{offer.description}</p>
              <ul>
                {offer.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <button className="button button-primary" onClick={() => openLead(`Дом КОНТУР — ${offer.label}, от ${offer.price.toFixed(1).replace(".", ",")} млн ₽`)}>
                Получить точный состав
                <ArrowIcon />
              </button>
            </article>
          ))}
        </div>

        <p className="shell offer-disclaimer">
          Цены — предварительный ориентир для базовых условий участка и не включают землю.
          Основание, наружные сети и индивидуальные изменения считаются после проверки участка.
        </p>

        <div className="shell finance-card">
          <div>
            <span>Единственный калькулятор на сайте</span>
            <h3>Посчитайте ипотечный сценарий.</h3>
            <p>
              Выберите стоимость дома, первоначальный взнос, ставку банка и срок.
              После расчёта можно сразу отправить выбранный сценарий в заявку.
            </p>
          </div>
          <button className="button button-primary" onClick={() => setCalculatorOpen(true)}>
            Рассчитать платёж
            <ArrowIcon />
          </button>
        </div>
      </section>

      <section className="scope-section shell">
        <div className="scope-head">
          <span className="section-index">10 / Границы расчёта</span>
          <h2>
            Понятно, что входит.
            <br />
            <em>Понятно, что считается отдельно.</em>
          </h2>
        </div>
        <div className="scope-grid">
          <article className="scope-fixed">
            <span>Фиксируем в предложении</span>
            <ul>
              <li>выбранную версию дома и комплектацию;</li>
              <li>согласованные материалы и состав работ;</li>
              <li>этапы, порядок приёмки и срок;</li>
              <li>итоговую стоимость согласованного объёма.</li>
            </ul>
          </article>
          <article>
            <span>Считаем по условиям участка</span>
            <ul>
              <li>сам участок и расходы по сделке;</li>
              <li>подъезд и подготовку площадки;</li>
              <li>фактическое решение по основанию;</li>
              <li>наружные сети и точки подключения;</li>
              <li>индивидуальные изменения проекта.</li>
            </ul>
          </article>
        </div>
        <p className="scope-note">
          Финальные состав и границы работ определяются коммерческим предложением
          и договором конкретного проекта.
        </p>
      </section>

      <section className="warranty-section">
        <img
          className="warranty-image"
          src="/images/kontur-family-interior-v1.webp"
          alt="Сгенерированная визуализация семейной кухни-гостиной дома КОНТУР"
        />
        <div className="warranty-shade" />
        <div className="shell warranty-content">
          <span className="section-index light">11 / После ключей</span>
          <strong className="warranty-number">5</strong>
          <div>
            <h2>
              лет гарантии.
              <br />
              <em>История дома остаётся с ним.</em>
            </h2>
            <p>
              Цифровой паспорт, история строительства и обращения по гарантии
              создают понятный маршрут после передачи. Объём и условия гарантии
              фиксируются в договоре.
            </p>
          </div>
        </div>
      </section>

      <section className="faq-section shell">
        <div className="faq-head">
          <span className="section-index">12 / Вопросы</span>
          <h2>
            До решения —
            <br />
            <em>всё по делу.</em>
          </h2>
          <p>
            Открываем ответы здесь, чтобы первый разговор был о вашем участке
            и доме, а не о расшифровке рекламных обещаний.
          </p>
        </div>
        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>0{index + 1}</span>
                {item.question}
                <i>+</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <img src="/images/house-side.webp" alt="" aria-hidden="true" />
        <div className="final-cta-shade" />
        <div className="shell final-cta-content">
          <span className="section-index light">Следующий шаг</span>
          <h2>
            Построим КОНТУР
            <br />
            <em>на подходящем участке.</em>
          </h2>
          <p>
            Если участок есть — проверим его. Если нет — поможем с подбором.
            Затем зафиксируем состав дома, цену и календарный график строительства.
          </p>
          <div>
            <button className="button button-primary" onClick={() => openLead("Финальная заявка — дом КОНТУР") }>
              Оставить заявку на КОНТУР
              <ArrowIcon />
            </button>
            <button className="button button-ghost" onClick={() => setTourOpen(true)}>
              Ещё раз посмотреть дом
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <a className="brand footer-brand" href="#top" aria-label="ИКИОМА — наверх">
            <img src="/images/logo.webp" alt="" aria-hidden="true" />
            <span>
              <strong>ИКИОМА</strong>
              <small>По-настоящему свой дом</small>
            </span>
          </a>
          <p>КОНТУР · 86,2 м² внутри · 23,1 м² терраса</p>
          <a href="#top">
            Наверх
            <ArrowIcon />
          </a>
        </div>
      </footer>

      <button className="mobile-sticky-cta" onClick={() => openLead("Мобильная заявка — дом КОНТУР") }>
        Оставить заявку на КОНТУР
        <ArrowIcon />
      </button>

      {tourOpen && (
        <div
          className="modal-backdrop tour-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setTourOpen(false);
          }}
        >
          <section className="tour-modal" role="dialog" aria-modal="true" aria-labelledby="tour-title">
            <button className="modal-close light" onClick={() => setTourOpen(false)} aria-label="Закрыть карточку дома">
              <CloseIcon />
            </button>
            <figure className={houseTour[activeTour].id === "layout" || houseTour[activeTour].id === "terrace-structure" ? "technical" : ""}>
              <img src={houseTour[activeTour].image} alt={houseTour[activeTour].alt} />
              <figcaption>КОНТУР · {houseTour[activeTour].caption}</figcaption>
            </figure>
            <div className="tour-copy">
              <span>120 м² застройки · 86,2 м² внутри</span>
              <h2 id="tour-title">{houseTour[activeTour].title}</h2>
              <p>{houseTour[activeTour].text}</p>
              <div className="tour-tabs" role="tablist" aria-label="Карточка дома КОНТУР">
                {houseTour.map((item, index) => (
                  <button
                    key={item.id}
                    className={activeTour === index ? "active" : ""}
                    onClick={() => setActiveTour(index)}
                    role="tab"
                    aria-selected={activeTour === index}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button className="button button-primary" onClick={() => openLead(`Карточка дома — ${houseTour[activeTour].label}`)}>
                Получить предложение
                <ArrowIcon />
              </button>
            </div>
          </section>
        </div>
      )}

      {leadOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLeadOpen(false);
          }}
        >
          <section className="lead-modal" role="dialog" aria-modal="true" aria-labelledby="lead-title">
            <button className="modal-close" onClick={() => setLeadOpen(false)} aria-label="Закрыть форму заявки">
              <CloseIcon />
            </button>
            {leadStatus === "sent" ? (
              <div className="lead-success">
                <span>Заявка принята</span>
                <h2 id="lead-title">Спасибо, {leadForm.name}.</h2>
                <p>Заявка уже в СтройкаОС. Свяжемся, чтобы уточнить участок и уровень готовности дома.</p>
                <button className="button button-dark" onClick={() => setLeadOpen(false)}>Вернуться на сайт</button>
              </div>
            ) : (
              <form onSubmit={submitLead}>
                <div className="lead-head">
                  <span>КОНТУР · заявка в СтройкаОС</span>
                  <h2 id="lead-title">Получить точное предложение.</h2>
                  <p>{leadContext}</p>
                </div>
                <div className="lead-fields">
                  <label>
                    <span>Как к вам обращаться</span>
                    <input required autoComplete="name" value={leadForm.name} onChange={(event) => setLeadForm({ ...leadForm, name: event.target.value })} placeholder="Имя" />
                  </label>
                  <label>
                    <span>Телефон</span>
                    <input required autoComplete="tel" inputMode="tel" value={leadForm.phone} onChange={(event) => setLeadForm({ ...leadForm, phone: event.target.value })} placeholder="+7 999 000-00-00" />
                  </label>
                  <label>
                    <span>Email, если удобно</span>
                    <input type="email" autoComplete="email" value={leadForm.email} onChange={(event) => setLeadForm({ ...leadForm, email: event.target.value })} placeholder="name@example.ru" />
                  </label>
                  <label>
                    <span>Участок</span>
                    <select value={leadForm.land} onChange={(event) => setLeadForm({ ...leadForm, land: event.target.value })}>
                      <option>Есть участок</option>
                      <option>Участок выбираю сам</option>
                      <option>Участка нет — нужна помощь</option>
                    </select>
                  </label>
                  <label className="lead-comment">
                    <span>Что важно учесть</span>
                    <textarea rows={3} value={leadForm.comment} onChange={(event) => setLeadForm({ ...leadForm, comment: event.target.value })} placeholder="Район, состав семьи, ипотека или желаемая дата старта" />
                  </label>
                  <label className="lead-honeypot" aria-hidden="true">
                    <span>Компания</span>
                    <input tabIndex={-1} autoComplete="off" value={leadForm.company} onChange={(event) => setLeadForm({ ...leadForm, company: event.target.value })} />
                  </label>
                </div>
                {leadStatus === "error" && <p className="lead-error">Заявка не дошла. Проверьте соединение и попробуйте ещё раз.</p>}
                <button className="button button-primary lead-submit" type="submit" disabled={leadStatus === "sending"}>
                  {leadStatus === "sending" ? "Отправляем…" : "Отправить заявку"}
                  <ArrowIcon />
                </button>
                <small className="lead-consent">Отправляя форму, вы соглашаетесь на обработку контактных данных для ответа на заявку.</small>
              </form>
            )}
          </section>
        </div>
      )}

      {calculatorOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setCalculatorOpen(false);
          }}
        >
          <section className="calculator-modal" role="dialog" aria-modal="true" aria-labelledby="calc-title">
            <button
              className="modal-close"
              onClick={() => setCalculatorOpen(false)}
              aria-label="Закрыть расчёт"
            >
              <CloseIcon />
            </button>
            <div className="calculator-head">
              <span>Предварительный сценарий</span>
              <h2 id="calc-title">Проверьте платёж до разговора с банком.</h2>
              <p>Меняйте параметры — расчёт обновится сразу.</p>
            </div>
            <div className="calculator-grid">
              <div className="calculator-controls">
                <label>
                  <span>
                    Стоимость дома
                    <b>{housePrice.toFixed(1).replace(".", ",")} млн ₽</b>
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="14"
                    step="0.1"
                    value={housePrice}
                    onChange={(event) => setHousePrice(Number(event.target.value))}
                  />
                </label>
                <label>
                  <span>
                    Первоначальный взнос
                    <b>{downPayment}%</b>
                  </span>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    step="5"
                    value={downPayment}
                    onChange={(event) => setDownPayment(Number(event.target.value))}
                  />
                </label>
                <div className="select-row">
                  <label>
                    <span>Ставка</span>
                    <select value={rate} onChange={(event) => setRate(Number(event.target.value))}>
                      <option value="6">6%</option>
                      <option value="8">8%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="24">24%</option>
                    </select>
                  </label>
                  <label>
                    <span>Срок</span>
                    <select value={term} onChange={(event) => setTerm(Number(event.target.value))}>
                      <option value="15">15 лет</option>
                      <option value="20">20 лет</option>
                      <option value="25">25 лет</option>
                      <option value="30">30 лет</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="calculator-result">
                <span>Ориентировочный платёж</span>
                <strong>
                  ≈ {formatMoney(calculation.payment)} ₽
                  <small>/мес</small>
                </strong>
                <dl>
                  <div>
                    <dt>Ваш взнос</dt>
                    <dd>{formatMoney(calculation.down)} ₽</dd>
                  </div>
                  <div>
                    <dt>Финансирование</dt>
                    <dd>{formatMoney(calculation.loan)} ₽</dd>
                  </div>
                </dl>
                <div className="calculator-actions">
                  <button
                    className="button button-dark"
                    onClick={() => openLead(`Ипотечный сценарий: дом ${housePrice.toFixed(1).replace(".", ",")} млн ₽, взнос ${downPayment}%, ставка ${rate}%, срок ${term} лет, платёж ≈ ${formatMoney(calculation.payment)} ₽/мес`)}
                  >
                    Отправить сценарий
                  </button>
                  <button className="calculator-copy" onClick={copyCalculation}>
                    {copyStatus === "copied" ? "Скопировано" : "Скопировать"}
                  </button>
                </div>
                {copyStatus === "manual" && (
                  <pre className="manual-copy" tabIndex={0}>
                    {manualText}
                  </pre>
                )}
                <p>
                  Это математический ориентир, не оферта и не решение банка. Точная
                  стоимость появляется после участка, проекта и комплектации.
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
