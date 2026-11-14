import type { Metadata } from "next";
import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "ВЕЛА — ипотечный расчёт | ИКИОМА",
  description: "Рассчитайте платёж по выбранной ставке, сроку и первоначальному взносу для строительства ВЕЛА.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="mortgage" />;
}
