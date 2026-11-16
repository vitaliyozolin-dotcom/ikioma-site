import VelaLanding from "@/components/VelaLanding";
import { catalog } from "@/components/vela-calculations";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": "https://ikioma.ru/#organization",
        name: "ИКИОМА", url: "https://ikioma.ru",
        areaServed: ["Санкт-Петербург", "Ленинградская область"],
      },
      {
        "@type": "Product", name: catalog.base.title,
        brand: { "@type": "Brand", name: "ИКИОМА" },
        description: "Домокомплект для одноэтажного дома из СИП-панелей с тремя спальнями. Фундамент, монтаж и дополнительные работы рассчитываются отдельно.",
        image: "https://ikioma.ru/vela/og.jpg",
        additionalProperty: [
          { "@type": "PropertyValue", name: "Стартовая цена домокомплекта, ₽", value: catalog.base.price },
          { "@type": "PropertyValue", name: "Площадь застройки", value: "115 м²" },
          { "@type": "PropertyValue", name: "Площадь помещений", value: "81,7 м²" },
          { "@type": "PropertyValue", name: "Площадь террасы", value: "22,2 м²" },
          { "@type": "PropertyValue", name: "Спальни", value: 3 },
          { "@type": "PropertyValue", name: "Санузлы", value: 1 },
        ],
      },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><VelaLanding /></>;
}
