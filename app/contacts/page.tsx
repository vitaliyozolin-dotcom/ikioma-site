/* eslint-disable @next/next/no-html-link-for-pages -- standalone Timeweb export uses document navigation */
import type { Metadata } from "next";
import { LegalPage, OperatorDetails } from "@/components/vela-legal";
import { operator } from "@/components/vela-legal-data";

export const metadata: Metadata = {
  title: "Контакты ИКИОМА | Проект ВЕЛА",
  description: "Контакты ИКИОМА и реквизиты ООО «Промтехнологии СПб». Строительство ВЕЛА в Санкт-Петербурге и Ленинградской области.",
  alternates: { canonical: "https://ikioma.ru/contacts/" },
};

export default function Page() {
  return <LegalPage title="Контакты">
    <p>Проект ВЕЛА для строительства в Санкт-Петербурге и Ленинградской области.</p>
    <p>Вопросы по проекту и смете можно обсудить по телефону <a href={"tel:" + operator.phoneHref}>{operator.phone}</a> или через <a href="/#contacts">форму расчёта</a>.</p>
    <h2>Реквизиты и адрес</h2><OperatorDetails />
  </LegalPage>;
}
