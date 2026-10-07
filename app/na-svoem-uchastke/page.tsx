import type { Metadata } from "next";
import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "VELA на вашем участке | SIP-дом ИКИОМА",
  description: "SIP-дом VELA на вашем участке: проверка условий, комплектация и полный ориентир бюджета строительства.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="own-land" />;
}
