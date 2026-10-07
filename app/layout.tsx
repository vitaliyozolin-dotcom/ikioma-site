import "@fontsource-variable/manrope";
import "./vela.css";
import "./vela-clean.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ikioma.ru"),
  title: "SIP-дом VELA от 5,2 млн ₽ | Семейная ипотека 6% | ИКИОМА",
  description: "Одноэтажный SIP-дом VELA: 86,2 м² внутри + крытая терраса 23,1 м², три комплектации от 5,2 млн ₽. Семейная ипотека на строительство — 6%*. Строим в Санкт-Петербурге, Ленинградской области, Москве и Московской области.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ikioma.ru",
    title: "SIP-дом VELA от 5,2 млн ₽ | Семейная ипотека 6% | ИКИОМА",
    description: "Одноэтажный SIP-дом для семьи. От 5,2 млн ₽. Семейная ипотека на строительство — 6%*.",
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
