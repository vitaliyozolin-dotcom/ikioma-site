import catalogData from "../public/vela/catalog.json";

export type Service = { id: string; title: string; price: number | null; description: string };
export type Catalog = Omit<typeof catalogData, "engineering" | "specification" | "warranty" | "promotion" | "mortgage" | "views"> & {
  views: Array<{ src: string; small?: string; label: string; caption: string; note: string; alt: string; width: number; height: number }>;
  engineering: Record<string, string | null>;
  specification: Array<{ title: string; description: string }>;
  warranty: string | null;
  promotion: string | null;
  mortgage: { source: string | null; minYears: number; maxYears: number; maxRate: number };
};

export const catalog: Catalog = catalogData;
export const services: Service[] = catalog.groups.flatMap(group => group.services);
export const serviceIds = new Set(services.map(service => service.id));

const rubles = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });
export const money = (value: number) => rubles.format(value) + " ₽";

export type Estimate = {
  version: string;
  validFrom: string;
  known: (Service & { price: number })[];
  pending: Service[];
  omitted: Service[];
  total: number;
};

export function estimate(selection: string[], data: Catalog = catalog): Estimate {
  const ids = new Set(selection);
  const known: Estimate["known"] = [{ ...data.base }];
  const pending: Service[] = [];
  const omitted: Service[] = [];
  for (const service of data.groups.flatMap(group => group.services)) {
    if (!ids.has(service.id)) omitted.push(service);
    else if (service.price === null) pending.push(service);
    else known.push({ ...service, price: service.price });
  }
  return { version: data.version, validFrom: data.validFrom, known, pending, omitted, total: known.reduce((total, row) => total + row.price, 0) };
}

export const selectionFor = (value: unknown): string[] => Array.isArray(value)
  ? [...new Set(value.filter((id): id is string => typeof id === "string" && serviceIds.has(id)))]
  : [];

export type MortgageInput = { budget: number; down: number; years: number; rate: number };
export type MortgageResult = MortgageInput & {
  deposit: number; principal: number; payment: number; total: number; interest: number;
  schedule: { year: number; balance: number; interest: number }[];
};

export function mortgage(input: MortgageInput): MortgageResult | null {
  const { budget, down, years, rate } = input;
  if (![budget, down, years, rate].every(Number.isFinite) || budget < 1 || budget > 100_000_000 || down < 0 || down > 100 ||
      years < catalog.mortgage.minYears || years > catalog.mortgage.maxYears || !Number.isInteger(years) || rate < 0 || rate > catalog.mortgage.maxRate) return null;
  const deposit = budget * down / 100;
  const principal = budget - deposit;
  const months = years * 12;
  const monthlyRate = rate / 1200;
  const payment = monthlyRate === 0 ? principal / months : principal * monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
  let balance = principal;
  let cumulativeInterest = 0;
  const schedule = [{ year: 0, balance, interest: cumulativeInterest }];
  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    cumulativeInterest += interest;
    balance = Math.max(0, balance - (payment - interest));
    if (month % 12 === 0) schedule.push({ year: month / 12, balance: month === months ? 0 : balance, interest: cumulativeInterest });
  }
  return { ...input, deposit, principal, payment, total: payment * months, interest: Math.max(0, payment * months - principal), schedule };
}

export type LivingInput = {
  people: number; mode: string; temperature: number; power: number; powerTariff: number;
  heatLow: number; heatHigh: number; heatTariff: number; waterMode: string; sewerMode: string;
  water: number; waterTariff: number; sewerTariff: number; other: number;
};
export function living(input: LivingInput) {
  const { people, temperature, power, powerTariff, heatLow, heatHigh, heatTariff, water, waterTariff, sewerTariff, other } = input;
  if (![people, temperature, power, powerTariff, heatLow, heatHigh, heatTariff, water, waterTariff, sewerTariff, other].every(Number.isFinite) ||
      people < 1 || people > 20 || !Number.isInteger(people) || temperature < 10 || temperature > 35 || heatHigh < heatLow ||
      [power, powerTariff, heatLow, heatHigh, heatTariff, water, waterTariff, sewerTariff, other].some(value => value < 0)) return null;
  const electric = power * powerTariff;
  const heat = [heatLow * heatTariff, heatHigh * heatTariff] as const;
  const waterCost = people * water * waterTariff;
  const sewerCost = people * water * sewerTariff;
  const subtotal = electric + waterCost + sewerCost + other;
  return { electric, heat, waterCost, sewerCost, other, totalLow: subtotal + heat[0], totalHigh: subtotal + heat[1] };
}
