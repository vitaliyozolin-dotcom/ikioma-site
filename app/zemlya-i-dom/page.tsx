import VelaLanding from "@/components/VelaLanding";

export const metadata: Metadata = {
  title: "Земля + дом VELA | ИКИОМА",
  description: "Поможем определить требования к участку, проверить землю и собрать бюджет строительства SIP-дома VELA.",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export default function Page() {
  return <VelaLanding scenario="land-home" />;
}
