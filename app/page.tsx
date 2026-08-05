import IkiomaLanding from "@/components/IkiomaLanding";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ИКИОМА",
    url: "https://ikioma.ru",
    description:
      "Современные дома из SIP-панелей с понятной комплектацией, видимым процессом и фиксируемым графиком.",
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
