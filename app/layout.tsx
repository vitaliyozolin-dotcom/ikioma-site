import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadataBase = new URL("https://ikioma.ru");

export const metadata: Metadata = {
  title: "ИКИОМА — по-настоящему свой дом",
  description:
    "Дома из SIP-панелей: понятная цена, видимый процесс и срок, который фиксируется до старта.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: "ИКИОМА — строим как для себя",
    description:
      "АРО 105: современный одноэтажный дом с террасой. Цена, срок и процесс без сюрпризов.",
    images: [
      {
        url: "https://ikioma.ru/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Дом АРО 105 от ИКИОМА",
      },
    ],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ikioma.ru" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d2323",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
