import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadataBase = new URL("https://ikioma.ru");

export const metadata: Metadata = {
  title: "Дом КОНТУР от ИКИОМА — по-настоящему свой дом",
  description:
    "КОНТУР: одноэтажный SIP-дом с тремя спальнями, двумя санузлами, 86,2 м² полезной площади и крытой террасой 23,1 м².",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: "Дом КОНТУР от ИКИОМА",
    description:
      "Три спальни, два санузла, 86,2 м² полезной площади и крытая терраса. 120 м² площади застройки: 96 + 24.",
    images: [
      {
        url: "https://ikioma.ru/images/og-kontur-v1.jpg",
        width: 1200,
        height: 630,
        alt: "Дом КОНТУР от ИКИОМА",
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
