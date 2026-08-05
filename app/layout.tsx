import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadataBase = new URL("https://ikioma.ru");

export const metadata: Metadata = {
  title: "ИКИОМА — по-настоящему свой дом",
  description:
    "АРО 120: одноэтажный SIP-дом 96 м² с крытой террасой 24 м². От 7,2 млн рублей, строительство до 4 месяцев.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: "ИКИОМА — строим как для себя",
    description:
      "АРО 120: 96 м² дома и 24 м² крытой террасы. Цена от 7,2 млн ₽, срок до 4 месяцев.",
    images: [
      {
        url: "https://ikioma.ru/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Дом АРО 120 от ИКИОМА",
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
