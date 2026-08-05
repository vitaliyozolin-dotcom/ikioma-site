import IkiomaLanding from "@/components/IkiomaLanding";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "ИКИОМА",
        url: "https://ikioma.ru",
        description: "Современные дома из SIP-панелей с понятной ценой, сроком и видимым процессом.",
      },
      {
        "@type": "Product",
        name: "Дом АРО 120",
        description: "Одноэтажный дом: 96 м² тёплой площади и 24 м² крытой террасы.",
        image: "https://ikioma.ru/images/hero.webp",
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "RUB",
          lowPrice: "5200000",
          highPrice: "7200000",
          offerCount: "3",
          url: "https://ikioma.ru/#finance",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <IkiomaLanding />
    </>
  );
}
