"use client";

/* eslint-disable @next/next/no-img-element -- local product imagery is optimized WebP */

import { useEffect, useMemo, useState, type FormEvent } from "react";

const houseOptions = [
  {
    id: "layout",
    label: "Планировка",
    title: "Один этаж — без лишних маршрутов.",
    text: "АРО 120 — 96 м² тёплой площади и 24 м² крытой террасы. Финальная схема помещений фиксируется в выбранной версии проекта.",
    image: "/images/option-layout.webp",
    alt: "Архитектор и семья обсуждают планировочное решение дома",
    caption: "Планировка / состав помещений и сценарии жизни",
    fixed: "Состав и размеры помещений, маршруты, расстановка мебели и связь с террасой.",
  },
  {
    id: "windows",
    label: "Окна",
    title: "Свет там, где он работает на дом.",
    text: "Размеры и расположение окон связываем с планировкой, фасадом и ориентацией дома на участке — до фиксации итогового расчёта.",
    image: "/images/option-windows.webp",
    alt: "Специалист проверяет панорамную оконную группу дома",
    caption: "Окна / размер, профиль и тип открывания",
    fixed: "Размеры, расположение, профиль, стеклопакет, тип открывания и цвет рам.",
  },
  {
    id: "facade",
    label: "Фасад",
    title: "Спокойная архитектура, понятные материалы.",
    text: "Цвет, фактуру и сочетания материалов выбираем как одну систему. Состав и объём фасадных работ указываются в коммерческом предложении.",
    image: "/images/option-facade.webp",
    alt: "Сочетание графитового металла и дерева на фасаде дома",
    caption: "Фасад / металл, дерево, цвет и фактура",
    fixed: "Материал, цвет, фактуру, долю дерева и ключевые узлы примыканий.",
  },
  {
    id: "engineering",
    label: "Инженерия",
    title: "Сначала схема, затем монтаж.",
    text: "Инженерные решения увязываем с домом и условиями участка. Конкретный набор систем, оборудование и границы работ появляются в расчёте.",
    image: "/images/option-engineering.webp",
    alt: "Монтаж тёплого пола и инженерных систем внутри дома",
    caption: "Инженерия / системы, трассы и оборудование",
    fixed: "Перечень систем, оборудование, точки подключения, трассы и границы монтажа.",
  },
  {
    id: "finishing",
    label: "Отделка",
    title: "Дом может закончиться там, где удобно вам.",
    text: "Уровень готовности выбирается до договора: от согласованного контура до варианта с отделкой. Без размытых формулировок «почти под ключ».",
    image: "/images/interior.webp",
    alt: "Готовый интерьер дома АРО 120",
    caption: "Отделка / материалы и уровень готовности",
    fixed: "Пол, стены, потолок, двери, санузлы и точный уровень готовности к заселению.",
  },
] as const;

const houseTour = [
  {
    id: "exterior",
    label: "Внешний вид",
    title: "АРО 120 с крытой террасой под общей кровлей",
    text: "Спокойная одноэтажная архитектура, графитовый фасад и тёплое дерево в зоне входа и террасы.",
    image: "/images/house-day.webp",
    alt: "Внешний вид одноэтажного дома АРО 120",
  },
  {
    id: "layout",
    label: "Планировка",
    title: "96 м² внутри — без площади ради площади",
    text: "Показываем логику помещений и связи с террасой. Точный технический план фиксируем после согласования состава семьи и сценария жизни.",
    image: "/images/option-layout.webp",
    alt: "Обсуждение планировочного решения дома АРО 120",
  },
  {
    id: "interior",
    label: "Внутри",
    title: "Общая зона раскрывается в сторону участка",
    text: "Кухня-гостиная, естественный свет и прямой выход на крытую террасу — главный повседневный сценарий дома.",
    image: "/images/interior.webp",
    alt: "Интерьер кухни-гостиной дома АРО 120",
  },
  {
    id: "terrace",
    label: "Терраса",
    title: "24 м², которые действительно работают",
    text: "Терраса входит в общую площадь 120 м² и защищена продолжением кровли — для стола, отдыха и летней кухни.",
    image: "/images/house-side.webp",
    alt: "Крытая терраса дома АРО 120",
  },
] as const;

const buildOffers = [
  {
    id: "shell",
    label: "01 / Тёплый контур",
    price: 5.2,
    term: "до 8 недель",
    description: "SIP-контур, кровля, окна и закрытый фасад.",
  },
  {
    id: "pre-finish",
    label: "02 / Под отделку",
    price: 6.3,
    term: "до 12 недель",
    description: "Тёплый контур плюс согласованная инженерия и подготовка поверхностей.",
  },
  {
    id: "ready",
    label: "03 / Готовый дом",
    price: 7.2,
    term: "до 4 месяцев",
    description: "Дом с отделкой, инженерией и готовностью к передаче ключей.",
  },
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
    text: "Проверяем исходные условия участка, подъезд, посадку дома и то, что влияет на основание и сети.",
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
    alt: "Монтаж SIP-панелей дома АРО 120",
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
    question: "Почему ИКИОМА начинает с одного дома?",
    answer:
      "Чтобы отработать один продукт полностью: архитектуру, комплектацию, контроль, документы и сервис. Вы видите конкретный дом, а не каталог обещаний.",
  },
  {
    question: "Когда появляется точная цена?",
    answer:
      "На сайте сразу виден ориентир каждого уровня готовности — от 5,2 до 7,2 млн ₽. Точную цену фиксируем после проверки участка и выбранного состава работ: отдельно считаются основание, наружные сети и индивидуальные изменения.",
  },
  {
    question: "Можно ли изменить АРО 120?",
    answer:
      "Можно выбрать и согласовать отдельные решения по планировке, окнам, фасаду, инженерии и отделке. Изменения считаются до фиксации проекта, чтобы не превращать стройку в цепочку доплат.",
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
  const [leadContext, setLeadContext] = useState("АРО 120 — готовый дом");
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
      const response = await fetch("https://stroios.online/api/public/leads", {
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
            <a href="#process" onClick={() => setMenuOpen(false)}>
              Как строим
            </a>
            <a href="#control" onClick={() => setMenuOpen(false)}>
              Контроль
            </a>
            <a href="#finance" onClick={() => setMenuOpen(false)}>
              Финансы
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
          src="/images/hero.webp"
          alt="Современный одноэтажный дом АРО 120 вечером"
        />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <div className="hero-copy">
            <h1>
              <span>По-настоящему</span>
              <em>свой дом.</em>
            </h1>
            <p className="hero-lead">
              120 м²: 96 м² дома и 24 м² крытой террасы. Стоимость готового
              дома — от 7,2 млн ₽, срок строительства — до 4 месяцев.
            </p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => openLead("АРО 120 — расчёт под участок") }>
                Получить предложение АРО 120
                <ArrowIcon />
              </button>
              <button className="hero-scroll-link" onClick={() => setTourOpen(true)}>
                Посмотреть дом
                <ArrowIcon />
              </button>
            </div>
            <p className="micro-note">
              Оставьте телефон — свяжемся по дому, а не для банковского спама.
            </p>
          </div>

          <aside className="hero-card" aria-label="Кратко о доме АРО 120">
            <div className="hero-card-top">
              <span>Первый дом ИКИОМА</span>
              <i>01</i>
            </div>
            <strong>АРО 120</strong>
            <p>Простая геометрия, тёплая архитектура и крытая терраса под общей кровлей.</p>
            <dl>
              <div>
                <dt>Площадь</dt>
                <dd>120 м²</dd>
              </div>
              <div>
                <dt>Этажность</dt>
                <dd>1 этаж</dd>
              </div>
              <div>
                <dt>Основа</dt>
                <dd>SIP</dd>
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
            <strong>7,2 млн ₽</strong>
            <span>готовый дом — ориентир</span>
          </div>
          <div>
            <strong>до 4 месяцев</strong>
            <span>срок строительства</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>видно, что на площадке</span>
          </div>
          <div>
            <strong>5 лет</strong>
            <span>гарантии в договоре</span>
          </div>
        </div>
      </section>

      <section className="house-intro shell" id="house">
        <div className="house-intro-copy">
          <span className="section-index">01 / АРО 120</span>
          <h2>
            Не каталог обещаний.
            <br />
            <em>Один дом — до каждой детали.</em>
          </h2>
          <p>
            Вы смотрите не абстрактный рендер, а конкретный продукт: одноэтажный
            АРО 120: 96 м² тёплой площади, 24 м² крытой террасы и понятный маршрут до ключей.
          </p>
          <ul className="house-facts" aria-label="Характеристики АРО 120">
            <li><strong>96 + 24 м²</strong><span>дом и терраса</span></li>
            <li><strong>1 этаж</strong><span>без лишних маршрутов</span></li>
            <li><strong>SIP</strong><span>тёплый контур</span></li>
          </ul>
          <button className="text-link" onClick={() => setTourOpen(true)}>
            Смотреть дом полностью
            <ArrowIcon />
          </button>
        </div>
        <figure className="house-intro-image">
          <img src="/images/house-day.webp" alt="Дом АРО 120 днём" />
          <figcaption>Визуализация на основе построенного объекта</figcaption>
        </figure>
      </section>

      <section className="configuration-section">
        <div className="shell configuration-head">
          <div>
            <span className="section-index">02 / Варианты</span>
            <h2>
              Дом узнаваемый.
              <br />
              <em>Решения — ваши.</em>
            </h2>
          </div>
          <p>
            Не переделываем АРО 120 до неузнаваемости. Настраиваем то, что влияет
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
          <figure>
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
            <button className="text-button" onClick={() => openLead(`АРО 120 — ${houseOptions[activeOption].label}`)}>
              Получить расчёт этого решения
              <ArrowIcon />
            </button>
          </div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="shell process-head">
          <div>
            <span className="section-index light">03 / Как строим</span>
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

      <section className="control-section shell" id="control">
        <div className="control-image">
          <img src="/images/site.webp" alt="Строительная площадка ИКИОМА с готовым домом" />
          <div className="control-stamp">
            <strong>24/7</strong>
            <span>видимый процесс</span>
          </div>
        </div>
        <div className="control-copy">
          <span className="section-index">04 / Контроль</span>
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
            <span className="section-index">05 / Цифровой контур</span>
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
            <span className="section-index light">06 / Цена и готовность</span>
            <h2>
              Три уровня готовности.
              <br />
              <em>Цена видна сразу.</em>
            </h2>
          </div>
          <p>
            Один АРО 120, но разная точка остановки. Выберите, где заканчивается
            наша работа — на тёплом контуре, подготовке под отделку или передаче ключей.
          </p>
        </div>

        <div className="shell offer-grid" aria-label="Варианты готовности дома АРО 120">
          {buildOffers.map((offer) => (
            <article className={offer.id === "ready" ? "offer-card featured" : "offer-card"} key={offer.id}>
              <span>{offer.label}</span>
              <strong>от {offer.price.toFixed(1).replace(".", ",")} млн ₽</strong>
              <small>{offer.term}</small>
              <p>{offer.description}</p>
              <button className="button button-primary" onClick={() => openLead(`АРО 120 — ${offer.label}, от ${offer.price.toFixed(1).replace(".", ",")} млн ₽`)}>
                Получить точный состав
                <ArrowIcon />
              </button>
            </article>
          ))}
        </div>

        <p className="shell offer-disclaimer">
          Цены — предварительный ориентир для базовых условий участка. Основание,
          наружные сети и индивидуальные изменения считаются после проверки участка.
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
          <span className="section-index">07 / Границы расчёта</span>
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
          src="/images/interior.webp"
          alt="Готовый интерьер дома АРО 120"
        />
        <div className="warranty-shade" />
        <div className="shell warranty-content">
          <span className="section-index light">08 / После ключей</span>
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
          <span className="section-index">09 / Вопросы</span>
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
            Построим АРО 120
            <br />
            <em>под ваш участок.</em>
          </h2>
          <p>
            Оставьте заявку — уточним участок и уровень готовности, затем дадим
            конкретный состав, цену и календарный график строительства.
          </p>
          <div>
            <button className="button button-primary" onClick={() => openLead("Финальная заявка — АРО 120") }>
              Оставить заявку на АРО 120
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
          <p>АРО 120 · 96 м² дом · 24 м² терраса</p>
          <a href="#top">
            Наверх
            <ArrowIcon />
          </a>
        </div>
      </footer>

      <button className="mobile-sticky-cta" onClick={() => openLead("Мобильная заявка — АРО 120") }>
        Оставить заявку на АРО 120
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
            <figure>
              <img src={houseTour[activeTour].image} alt={houseTour[activeTour].alt} />
              <figcaption>АРО 120 · {houseTour[activeTour].label}</figcaption>
            </figure>
            <div className="tour-copy">
              <span>120 м² · 96 + 24</span>
              <h2 id="tour-title">{houseTour[activeTour].title}</h2>
              <p>{houseTour[activeTour].text}</p>
              <div className="tour-tabs" role="tablist" aria-label="Карточка дома АРО 120">
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
                  <span>АРО 120 · заявка в СтройкаОС</span>
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
                      <option>Подбираю участок</option>
                      <option>Нужна помощь с выбором</option>
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
