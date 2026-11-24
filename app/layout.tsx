import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "./vela-base.css";
import "./vela-legal.css";
import "./vela-master.css";
import { catalog, money } from "@/components/vela-calculations";

const metrikaScript = "(function(m,e,t,r,i,k,a){\nm[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};\nm[i].l=1*new Date();\nfor(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}\nk=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);\n})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=114376193','ym');\nym(114376193,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:\"dataLayer\",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});";

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
  return <html lang="ru"><head>
    <script id="yandex-metrika" dangerouslySetInnerHTML={{ __html: metrikaScript }} />
  </head><body>
    <noscript><div><img src="https://mc.yandex.ru/watch/114376193" style={{ position: "absolute", left: "-9999px" }} alt="" /></div></noscript>
    {children}
  </body></html>;
}
