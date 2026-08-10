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
        name: "Дом КОНТУР",
        description: "Одноэтажный SIP-дом: 86,2 м² полезной площади, три спальни, два санузла и крытая терраса 23,1 м².",
        image: "https://ikioma.ru/images/kontur-family-exterior-v1.webp",
        additionalProperty: [
          { "@type": "PropertyValue", name: "Площадь застройки", value: "120 м²" },
          { "@type": "PropertyValue", name: "Внешний контур дома", value: "96 м²" },
          { "@type": "PropertyValue", name: "Полезная площадь", value: "86,2 м²" },
          { "@type": "PropertyValue", name: "Терраса", value: "23,1 м²" },
        ],
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
