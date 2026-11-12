import type { Metadata } from "next";
import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "Участок и дом ВЕЛА | ИКИОМА",
  description: "Уточните требования к участку и предварительный бюджет строительства ВЕЛА.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="land-home" />;
}
