import type { Metadata } from "next";
import { LegalPage, OperatorDetails } from "@/components/vela-legal";

export const metadata: Metadata = {
  title: "Реквизиты | ИКИОМА",
  description: "Реквизиты ООО «Промтехнологии СПб» и контакты для обращений по сайту ИКИОМА.",
  alternates: { canonical: "https://ikioma.ru/requisites/" },
};
export default function Page() {
  return <LegalPage title="Реквизиты">
    <p>Обращения через сайт ИКИОМА принимает ООО «Промтехнологии СПб».</p>
    <OperatorDetails />
    <p>Банковские реквизиты для оплаты указываются в договоре и счёте. Перед оплатой проверьте, что получатель и назначение платежа соответствуют вашим документам.</p>
  </LegalPage>;
}
