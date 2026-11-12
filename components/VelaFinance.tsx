"use client";

import { useState, type ReactNode } from "react";
import { catalog, living, money, mortgage, type Estimate, type LivingInput, type MortgageResult } from "./vela-calculations";

type FieldProps = { id: string; label: string; value: string; set: (value: string) => void; min?: number; max?: number; step?: number; placeholder?: string; slider?: boolean; sliderStep?: number };
function Field({ id, label, value, set, min = 0, max, step = 1, placeholder, slider, sliderStep }: FieldProps) {
  return <div className="vl-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="number" inputMode={step < 1 ? "decimal" : "numeric"} value={value} min={min} max={max} step={step} placeholder={placeholder} onChange={event => set(event.target.value)} />
    {slider && <input className="vl-range" type="range" aria-label={label + ", ползунок"} value={value || min} min={min} max={max} step={sliderStep ?? step} onChange={event => set(event.target.value)} />}
  </div>;
}

function Choice({ id, label, children, value, set }: { id: string; label: string; children: ReactNode; value: string; set: (value: string) => void }) {
  return <div className="vl-field"><label htmlFor={id}>{label}</label><select id={id} value={value} onChange={event => set(event.target.value)}>{children}</select></div>;
}

function DebtChart({ result }: { result: MortgageResult }) {
  const maximum = Math.max(1, result.principal, result.interest);
  const points = (key: "balance" | "interest") => result.schedule.map(point => `${12 + 336 * point.year / result.years},${132 - 108 * point[key] / maximum}`).join(" ");
  return <figure className="vl-debt-chart">
    <svg viewBox="0 0 360 148" role="img" aria-label="График: остаток долга снижается, выплаченные проценты накапливаются">
      {[24, 60, 96, 132].map(y => <path key={y} d={`M12 ${y}H348`} stroke="#c9cfc6" strokeWidth="1" />)}
      <polyline points={points("balance")} fill="none" stroke="#334b3d" strokeWidth="3" strokeLinejoin="round" />
      <polyline points={points("interest")} fill="none" stroke="#a24a2a" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
    <div className="vl-chart-axis"><span>Начало</span><span>{result.years} г.</span></div>
    <figcaption><span>Остаток долга</span><span>Уплаченные проценты</span></figcaption>
    <details><summary>График по годам в таблице</summary><div className="vl-schedule"><table><thead><tr><th scope="col">Год</th><th scope="col">Долг</th><th scope="col">Проценты</th></tr></thead><tbody>{result.schedule.map(point => <tr key={point.year}><th scope="row">{point.year}</th><td>{money(point.balance)}</td><td>{money(point.interest)}</td></tr>)}</tbody></table></div></details>
  </figure>;
}

const livingDefaults = {
  people: "3", temperature: "21", power: "", powerTariff: "", heatLow: "", heatHigh: "", heatTariff: "",
  water: "", waterTariff: "", sewerTariff: "", other: "", current: "",
};
const heatModes: Record<string, { energy: string; tariff: string }> = {
  electric: { energy: "кВт·ч", tariff: "₽/кВт·ч" }, gas: { energy: "м³", tariff: "₽/м³" }, solid: { energy: "кг", tariff: "₽/кг" },
};

export default function VelaFinance({ quote, onLead, onMortgage, track }: {
  quote: Estimate;
  onLead: (kind: "mortgage" | "estimate") => void;
  onMortgage: (value: MortgageResult | null) => void;
  track: (name: string) => void;
}) {
  const [budget, setBudget] = useState("");
  const [down, setDown] = useState("20");
  const [years, setYears] = useState("20");
  const [rate, setRate] = useState("");
  const [financeUsed, setFinanceUsed] = useState(false);
  const [operating, setOperating] = useState(livingDefaults);
  const [heatMode, setHeatMode] = useState("electric");
  const [waterMode, setWaterMode] = useState("network");
  const [sewerMode, setSewerMode] = useState("network");
  const unit = heatModes[heatMode];
  const scenario = budget !== "" && down !== "" && years !== "" && rate !== ""
    ? mortgage({ budget: Number(budget), down: Number(down), years: Number(years), rate: Number(rate) })
    : null;
  const requiredOperating: (keyof typeof livingDefaults)[] = ["people", "temperature", "power", "powerTariff", "heatLow", "heatHigh", "heatTariff"];
  if (waterMode === "network" || sewerMode === "network") requiredOperating.push("water");
  if (waterMode === "network") requiredOperating.push("waterTariff");
  if (sewerMode === "network") requiredOperating.push("sewerTariff");
  const input: LivingInput = {
    people: Number(operating.people), temperature: Number(operating.temperature), mode: heatMode,
    power: Number(operating.power), powerTariff: Number(operating.powerTariff), heatLow: Number(operating.heatLow),
    heatHigh: Number(operating.heatHigh), heatTariff: Number(operating.heatTariff), waterMode, sewerMode,
    water: Number(operating.water), waterTariff: waterMode === "network" ? Number(operating.waterTariff) : 0,
    sewerTariff: sewerMode === "network" ? Number(operating.sewerTariff) : 0, other: Number(operating.other),
  };
  const expenses = requiredOperating.every(key => operating[key] !== "") ? living(input) : null;
  const range = (a: number, b: number) => Math.round(a) === Math.round(b) ? money(a) : `${money(a)} – ${money(b)}`;

  function updateMortgage(set: (value: string) => void, value: string) {
    set(value);
    if (!financeUsed) { track("mortgage_calculator_open"); setFinanceUsed(true); }
  }

  function operatingField(key: keyof typeof livingDefaults, label: string, options: Partial<FieldProps> = {}) {
    return <Field id={"vl-living-" + key} label={label} value={operating[key]} set={value => setOperating(previous => ({ ...previous, [key]: value }))} {...options} />;
  }

  return <>
    <section className="vl-finance-band" id="mortgage" aria-labelledby="vl-mortgage-title">
      <div className="vl-section vl-wrap">
        <div className="vl-section-heading"><div><p className="vl-kicker">Финансирование</p><h2 id="vl-mortgage-title">Рассчитать <em>ипотеку</em></h2></div>
          <p>Укажите полный бюджет строительства и ставку, по которой хотите оценить платёж. Сумму из калькулятора можно использовать как отправную точку.</p></div>
        <div className="vl-finance-grid">
          <div className="vl-finance-form">
            <div className="vl-form-fields">
              <Field id="vl-budget" label="Бюджет строительства, ₽" value={budget} set={value => updateMortgage(setBudget, value)} min={1} max={100_000_000} placeholder="Ваш бюджет" slider sliderStep={10_000} />
              <Field id="vl-down" label="Первоначальный взнос, %" value={down} set={value => updateMortgage(setDown, value)} max={100} step={0.1} slider />
              <Field id="vl-years" label="Срок кредита, лет" value={years} set={value => updateMortgage(setYears, value)} min={catalog.mortgage.minYears} max={catalog.mortgage.maxYears} slider />
              <Field id="vl-rate" label="Годовая ставка, %" value={rate} set={value => updateMortgage(setRate, value)} max={catalog.mortgage.maxRate} step={0.1} placeholder="Ваша ставка" slider />
            </div>
            <button type="button" className="vl-text-button" onClick={() => updateMortgage(setBudget, String(quote.total))}>Подставить рассчитанную часть · {money(quote.total)}</button>
            <p className="vl-note">Сценарный аннуитетный расчёт. Страховки и комиссии банка учитываются отдельно.</p>
            {catalog.mortgage.source && <p><a href={catalog.mortgage.source}>Источник условий финансирования</a></p>}
          </div>
          <div className="vl-finance-result" aria-live="polite">
            <p>Ежемесячный платёж</p><strong className="vl-display-value">{scenario ? money(scenario.payment) : "—"}</strong>
            {scenario ? <>
              <dl className="vl-cost-lines"><div><dt>Первоначальный взнос</dt><dd>{money(scenario.deposit)}</dd></div><div><dt>Сумма кредита</dt><dd>{money(scenario.principal)}</dd></div><div><dt>Всего платежей по кредиту</dt><dd>{money(scenario.total)}</dd></div><div><dt>Переплата по процентам</dt><dd>{money(scenario.interest)}</dd></div></dl>
              <DebtChart result={scenario} />
            </> : <p className="vl-note">Для расчёта нужны бюджет, взнос, срок и ставка в пределах полей.</p>}
            <button type="button" className="vl-btn vl-btn-outline" onClick={() => { onMortgage(scenario); onLead("mortgage"); }}>Обсудить финансирование</button>
          </div>
        </div>
      </div>
    </section>
    <section className="vl-section vl-wrap" id="expenses" aria-labelledby="vl-expenses-title">
      <div className="vl-section-heading"><div><p className="vl-kicker">Содержание дома</p><h2 id="vl-expenses-title">Месячный <em>бюджет</em></h2></div>
        <p>Подставьте своё потребление и тарифы. Для отопления можно сравнить два месяца с разным расходом энергии.</p></div>
      <div className="vl-finance-grid">
        <div className="vl-finance-form">
          <div className="vl-form-fields">
            {operatingField("people", "Проживающих", { min: 1, max: 20 })}
            {operatingField("temperature", "Температура в доме, °C", { min: 10, max: 35, step: 0.5 })}
            <Choice id="vl-heating" label="Отопление" value={heatMode} set={setHeatMode}><option value="electric">Электричество</option><option value="gas">Газ</option><option value="solid">Твёрдое топливо</option></Choice>
            {operatingField("heatTariff", "Тариф отопления, " + unit.tariff, { step: .01 })}
            {operatingField("heatLow", "Мягкий месяц, " + unit.energy, { step: .1 })}
            {operatingField("heatHigh", "Холодный месяц, " + unit.energy, { step: .1 })}
            {operatingField("power", "Электричество без отопления, кВт·ч/мес.", { step: .1 })}
            {operatingField("powerTariff", "Тариф электричества, ₽/кВт·ч", { step: .01 })}
            <Choice id="vl-water" label="Водоснабжение" value={waterMode} set={setWaterMode}><option value="network">Центральное</option><option value="local">Скважина или колодец</option></Choice>
            <Choice id="vl-sewer" label="Канализация" value={sewerMode} set={setSewerMode}><option value="network">Центральная</option><option value="local">Септик или локальная станция</option></Choice>
            {(waterMode === "network" || sewerMode === "network") && operatingField("water", "Вода на человека, м³/мес.", { step: .1 })}
            {waterMode === "network" && operatingField("waterTariff", "Тариф воды, ₽/м³", { step: .01 })}
            {sewerMode === "network" && operatingField("sewerTariff", "Тариф канализации, ₽/м³", { step: .01 })}
            {operatingField("other", "Обслуживание и другие расходы, ₽/мес.", { placeholder: "При необходимости" })}
            {operatingField("current", "Ваши расходы сейчас, ₽/мес.", { placeholder: "Для сравнения" })}
          </div>
          <p className="vl-note">Температура описывает выбранный сценарий. Укажите расход отопления, который ей соответствует. Для скважины и септика укажите обслуживание в других расходах, а электроэнергию насоса — в общем потреблении.</p>
        </div>
        <div className="vl-finance-result" aria-live="polite">
          <p>Содержание в месяц</p><strong className="vl-display-value">{expenses ? range(expenses.totalLow, expenses.totalHigh) : "—"}</strong>
          {expenses ? <dl className="vl-cost-lines">
            <div><dt>Отопление</dt><dd>{range(...expenses.heat)}</dd></div><div><dt>Электричество без отопления</dt><dd>{money(expenses.electric)}</dd></div>
            <div><dt>Вода</dt><dd>{waterMode === "network" ? money(expenses.waterCost) : "В обслуживании"}</dd></div><div><dt>Канализация</dt><dd>{sewerMode === "network" ? money(expenses.sewerCost) : "В обслуживании"}</dd></div><div><dt>Другие расходы</dt><dd>{money(expenses.other)}</dd></div>
            {operating.current !== "" && Number(operating.current) >= 0 && <div><dt>Ваши расходы сейчас</dt><dd>{money(Number(operating.current))}</dd></div>}
          </dl> : <p className="vl-note">Введите расходы энергии и тарифы. Для центральных сетей также укажите расход воды и стоимость по тарифу.</p>}
        </div>
      </div>
    </section>
    <section className="vl-wrap vl-finance-summary" aria-labelledby="vl-summary-title">
      <h2 id="vl-summary-title">Бюджет по вашему сценарию</h2>
      <dl>
        <div><dt>Рассчитано по выбранным работам</dt><dd>от {money(quote.total)}</dd></div>
        <div><dt>Выбрано с индивидуальным расчётом</dt><dd>{quote.pending.length ? quote.pending.map(item => item.title).join(", ") : "Пока без таких работ"}</dd></div>
        <div><dt>Первоначальный взнос</dt><dd>{scenario ? money(scenario.deposit) : "Укажите бюджет и ставку"}</dd></div>
        <div><dt>Ипотечный платёж в месяц</dt><dd>{scenario ? money(scenario.payment) : "—"}</dd></div>
        <div><dt>Содержание дома в месяц</dt><dd>{expenses ? range(expenses.totalLow, expenses.totalHigh) : "—"}</dd></div>
        <div><dt>Общий бюджет в месяц</dt><dd>{scenario && expenses ? range(scenario.payment + expenses.totalLow, scenario.payment + expenses.totalHigh) : "После обоих расчётов"}</dd></div>
      </dl>
      <button type="button" className="vl-btn vl-btn-primary" onClick={() => { onMortgage(scenario); onLead("estimate"); }}>Получить расчёт для участка</button>
    </section>
  </>;
}
