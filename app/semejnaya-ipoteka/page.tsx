import type { Metadata } from "next";
import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "VELA по семейной ипотеке 6% | ИКИОМА",
  description: "Строительство SIP-дома VELA по семейной ипотеке 6% для семей, соответствующих условиям программы.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="mortgage" />;
}
