import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "./vela-base.css";
import "./vela-legal.css";
import "./vela-master.css";
import { catalog, money } from "@/components/vela-calculations";

export const metadata: Metadata = {
  metadataBase: new URL("https://ikioma.ru"),
  title: `Домокомплект ВЕЛА от ${money(catalog.base.price)} | ИКИОМА`,
  description: "ВЕЛА — одноэтажный дом из СИП-панелей в Санкт-Петербурге и Ленинградской области. Три спальни, терраса 22,2 м², планировка и калькулятор стоимости строительства.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: `Домокомплект ВЕЛА от ${money(catalog.base.price)} | ИКИОМА`,
    description: "Планировка ВЕЛА, комплектация и предварительный расчёт строительства.",
    images: [{ url: "/vela/og.jpg", width: 1200, height: 630, alt: "Визуализация графитового фасада ВЕЛА с деревянной террасой" }],
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/favicon-32.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171d1c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
