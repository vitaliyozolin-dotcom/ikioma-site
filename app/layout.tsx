import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./vela.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ikioma.ru"),
  title: "ИКИОМА | VELA — по-настоящему свой дом",
  description: "VELA: одноэтажный SIP-дом, три спальни, два санузла, 86,2 м² внутри и крытая терраса 23,1 м². Планировка, комплектации и расчёт под ваш участок.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: "ИКИОМА | VELA — по-настоящему свой дом",
    description: "Рассмотрите дом и планировку. Выберите тёплый контур, инженерный пакет или отделку под ключ.",
    images: [{ url: "https://ikioma.ru/images/kontur-family-exterior-v1.webp", alt: "Архитектурная визуализация дома VELA от ИКИОМА" }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#202a25",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
