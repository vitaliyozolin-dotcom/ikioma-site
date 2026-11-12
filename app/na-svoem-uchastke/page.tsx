import type { Metadata } from "next";
import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "ВЕЛА на вашем участке | ИКИОМА",
  description: "Строительство одноэтажного дома ВЕЛА из СИП-панелей. Комплектация и предварительный расчёт для вашего участка.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="own-land" />;
}
