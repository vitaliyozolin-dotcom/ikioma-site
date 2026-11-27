"use client";

import { useState } from "react";
import { catalog, money, mortgage, type Estimate, type MortgageResult } from "./vela-calculations";

type FieldProps = { id: string; label: string; value: string; set: (value: string) => void; min?: number; max?: number; step?: number; placeholder?: string };
function Field({ id, label, value, set, min = 0, max, step = 1, placeholder }: FieldProps) {
  return <div className="vl-field">
    <label htmlFor={id}>{label}</label>
    <input id={id} type="number" inputMode={step < 1 ? "decimal" : "numeric"} value={value} min={min} max={max} step={step} placeholder={placeholder} onChange={event => set(event.target.value)} />
  </div>;
}

function DebtChart({ result }: { result: MortgageResult }) {
  const maximum = Math.max(1, result.principal, result.interest);
  const points = (key: "balance" | "interest") => result.schedule.map(point => `${64 + 270 * point.year / result.years},${132 - 108 * point[key] / maximum}`).join(" ");
  return <figure className="vl-debt-chart">
    <svg viewBox="0 0 360 148" role="img" aria-label="График: остаток долга снижается, выплаченные проценты накапливаются">
      {[24, 60, 96, 132].map(y => <g key={y}><path d={`M64 ${y}H334`} stroke="#c9cfc6" strokeWidth="1" /><text x="56" y={y + 4} textAnchor="end" fontSize="10" fill="#526052">{((132-y)/108*maximum/1000000).toFixed(1)} млн</text></g>)}
      <polyline points={points("balance")} fill="none" stroke="#334b3d" strokeWidth="3" strokeLinejoin="round" />
      <polyline points={points("interest")} fill="none" stroke="#a24a2a" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
    <div className="vl-chart-axis"><span>0 лет</span><span>{Math.round(result.years / 2)} лет</span><span>{result.years} лет</span></div>
    <figcaption><span>Остаток долга</span><span>Уплаченные проценты</span></figcaption>
    <details><summary>График по годам в таблице</summary><div className="vl-schedule"><table><thead><tr><th scope="col">Год</th><th scope="col">Долг</th><th scope="col">Проценты</th></tr></thead><tbody>{result.schedule.map(point => <tr key={point.year}><th scope="row">{point.year}</th><td>{money(point.balance)}</td><td>{money(point.interest)}</td></tr>)}</tbody></table></div></details>
  </figure>;
}

export default function VelaFinance({ mode, quote, onLead, onMortgage, track }: {
  mode: "construction" | "mortgage" | "expenses";
  quote: Estimate;
  onLead: (kind: "mortgage" | "estimate", context?: string) => void;
  onMortgage: (value: MortgageResult | null) => void;
  track: (name: string) => void;
}) {
  const [customBudget, setBudget] = useState<string | null>(null);
  const budget = customBudget ?? String(quote.total);
  const [down, setDown] = useState("20");
  const [years, setYears] = useState("15");
  const [rate, setRate] = useState("6");
  const [financeUsed, setFinanceUsed] = useState(false);
  const [residents, setResidents] = useState("4");
  const [residence, setResidence] = useState("Постоянно");
  const scenario = budget !== "" && down !== "" && years !== "" && rate !== ""
    ? mortgage({ budget: Number(budget), down: Number(down), years: Number(years), rate: Number(rate) })
    : null;

  function updateMortgage(set: (value: string) => void, value: string) {
    set(value);
    if (!financeUsed) { track("mortgage_calculator_open"); setFinanceUsed(true); }
  }

  function requestExpenses() {
    onMortgage(null);
    onLead("estimate", `Оценка содержания ВЕЛА: жильцов — ${residents}; проживание — ${residence}; своя скважина и септик. Нужны расходы зимой и летом, обслуживание отдельно.`);
  }

  return <>
    <section hidden={mode !== "mortgage"} id="mortgage" aria-labelledby="vl-mortgage-title">
      <div className="vl-calc-panel-heading">
        <h3 id="vl-mortgage-title">Какой будет платёж в месяц?</h3>
        <p>Возьмите сумму из комплектации или введите полный бюджет строительства.</p>
      </div>
      <div className="vl-finance-grid">
        <div className="vl-finance-form">
          <div className="vl-budget-input">
            <Field id="vl-budget" label="Бюджет строительства, ₽" value={budget} set={value => updateMortgage(setBudget, value)} min={1} max={100_000_000} placeholder="Ваш бюджет" />
            {customBudget === null
              ? <p className="vl-budget-source">Из расчёта стоимости ВЕЛА. Учтены позиции с ценой.</p>
              : <button type="button" className="vl-text-button" onClick={() => setBudget(null)}>Вернуть сумму из расчёта · {money(quote.total)}</button>}
          </div>
          <div className="vl-form-fields">
            <Field id="vl-down" label="Первоначальный взнос, %" value={down} set={value => updateMortgage(setDown, value)} max={100} step={0.1} />
            <Field id="vl-years" label="Срок кредита, лет" value={years} set={value => updateMortgage(setYears, value)} min={catalog.mortgage.minYears} max={catalog.mortgage.maxYears} />
            <Field id="vl-rate" label="Годовая ставка, %" value={rate} set={value => updateMortgage(setRate, value)} max={catalog.mortgage.maxRate} step={0.1} />
          </div>
          <p className="vl-note">Начальная ставка в калькуляторе — 6% для сценария семейной ипотеки. Условия подтверждает банк. Страховки и комиссии рассчитываются отдельно.</p>
          {catalog.mortgage.source && <p><a href={catalog.mortgage.source}>Источник условий финансирования</a></p>}
        </div>
        <div className="vl-finance-result">
          <div aria-live="polite" aria-atomic="true">
            <p className="vl-result-label">Ежемесячный платёж</p>
            <strong className="vl-display-value">{scenario ? money(scenario.payment) : "—"}</strong>
          </div>
          {scenario ? <>
            <dl className="vl-cost-lines">
              <div><dt>Бюджет</dt><dd>{money(scenario.budget)}</dd></div>
              <div><dt>Первоначальный взнос</dt><dd>{money(scenario.deposit)}</dd></div>
              <div><dt>Сумма кредита</dt><dd>{money(scenario.principal)}</dd></div>
              <div><dt>Всего платежей по кредиту</dt><dd>{money(scenario.total)}</dd></div>
              <div><dt>Переплата по процентам</dt><dd>{money(scenario.interest)}</dd></div>
            </dl>
            <DebtChart result={scenario} />
          </> : <p className="vl-note">Введите бюджет, взнос, срок и ставку в пределах полей.</p>}
          <button type="button" className="vl-btn vl-btn-primary" onClick={() => { onMortgage(scenario); onLead("mortgage"); }}>Обсудить финансирование</button>
        </div>
      </div>
    </section>
    <section hidden={mode !== "expenses"} id="expenses" aria-labelledby="vl-expenses-title">
      <div className="vl-calc-panel-heading">
        <h3 id="vl-expenses-title">Сколько будет стоить содержание?</h3>
        <p>Укажите, сколько человек будет жить в доме и как часто. Подготовим оценку на зиму и лето.</p>
      </div>
      <div className="vl-finance-grid">
        <div className="vl-finance-form vl-living-form">
          <div className="vl-form-fields">
            <div className="vl-field">
              <label htmlFor="vl-residents">Сколько человек будет жить?</label>
              <select id="vl-residents" value={residents} onChange={event => setResidents(event.target.value)}>
                {["1", "2", "3", "4", "5", "6 и больше"].map(count => <option key={count}>{count}</option>)}
              </select>
            </div>
            <div className="vl-field">
              <label htmlFor="vl-residence">Режим проживания</label>
              <select id="vl-residence" value={residence} onChange={event => setResidence(event.target.value)}>
                {["Постоянно", "По выходным", "Только летом"].map(option => <option key={option}>{option}</option>)}
              </select>
            </div>
          </div>
          <p className="vl-note">Для оценки уточним тариф на электричество, систему отопления и оборудование.</p>
        </div>
        <div className="vl-finance-result vl-living-result">
          <p className="vl-result-label">Что войдёт в оценку</p>
          <dl>
            <div><dt>Электричество зимой и летом</dt><dd>Отопление, горячая вода, освещение и техника.</dd></div>
            <div><dt>Обслуживание оборудования</dt><dd>Скважина, септик и фильтры с учётом периодичности работ.</dd></div>
          </dl>
          <button type="button" className="vl-btn vl-btn-primary" onClick={requestExpenses}>Получить оценку расходов</button>
        </div>
      </div>
    </section>
  </>;
}
