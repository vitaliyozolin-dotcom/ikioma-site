import VelaLanding from "@/components/VelaLanding";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ikioma.ru/#organization",
        name: "ИКИОМА",
        url: "https://ikioma.ru",
        description: "Одноэтажные дома из SIP-панелей с согласованной комплектацией и поэтапной приёмкой.",
      },
      {
        "@type": "Product",
        name: "ИКИОМА | VELA",
        brand: { "@type": "Brand", name: "ИКИОМА" },
        description: "Одноэтажный SIP-дом: три спальни, два санузла, 86,2 м² внутри и крытая терраса 23,1 м². Цены комплектаций являются предварительными ориентирами; земля и условия участка рассчитываются отдельно.",
        image: "https://ikioma.ru/images/kontur-family-exterior-v1.webp",
        additionalProperty: [
          { "@type": "PropertyValue", name: "Полезная площадь помещений", value: "86,2 м²" },
          { "@type": "PropertyValue", name: "Крытая терраса, отдельно от помещений", value: "23,1 м²" },
          { "@type": "PropertyValue", name: "Спальни в опубликованном проекте", value: "3" },
          { "@type": "PropertyValue", name: "Санузлы", value: "2" },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><VelaLanding /></>;
}
