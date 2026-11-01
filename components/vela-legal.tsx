/* eslint-disable @next/next/no-html-link-for-pages -- native navigation is required by this static export */
/* eslint-disable @next/next/no-img-element -- existing optimized brand asset */
import type { ReactNode } from "react";
import { LEGAL_DATE, operator } from "./vela-legal-data";

export function ConsentCopy() {
  return <span>Даю <a href="/consent/" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a> для ответа на мою заявку.</span>;
}

export function LegalFooter() {
  return <div className="v-legal-footer">
    <div><strong>{operator.name}</strong><p>ИНН {operator.inn} · ОГРН {operator.ogrn}</p></div>
    <div className="v-legal-contacts"><a href={"tel:" + operator.phoneHref}>{operator.phone}</a><a href={"mailto:" + operator.email}>{operator.email}</a></div>
    <nav aria-label="Документы сайта"><a href="/privacy/">Политика конфиденциальности</a><a href="/consent/">Согласие на обработку данных</a><a href="/requisites/">Реквизиты</a></nav>
  </div>;
}

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return <div className="vela v-legal-page">
    <header className="v-legal-header v-shell"><a className="v-brand" href="/" aria-label="На главную ИКИОМА"><img src="/images/logo.webp" alt="" width="33" height="38" /><span><strong>ИКИОМА</strong><small>По-настоящему свой дом</small></span></a><a className="v-text-link" href="/">Вернуться на сайт</a></header>
    <main className="v-legal-document"><h1>{title}</h1><p className="v-legal-date">Редакция от {LEGAL_DATE}</p>{children}</main>
    <footer className="v-shell v-legal-page-footer"><LegalFooter /></footer>
  </div>;
}

export function OperatorDetails() {
  return <dl className="v-requisites">
    <div><dt>Полное наименование</dt><dd>{operator.fullName}</dd></div>
    <div><dt>ИНН / КПП</dt><dd>{operator.inn} / {operator.kpp}</dd></div>
    <div><dt>ОГРН</dt><dd>{operator.ogrn}</dd></div>
    <div><dt>Юридический адрес</dt><dd>{operator.address}</dd></div>
    <div><dt>Электронная почта</dt><dd><a href={"mailto:" + operator.email}>{operator.email}</a></dd></div>
    <div><dt>Телефон</dt><dd><a href={"tel:" + operator.phoneHref}>{operator.phone}</a></dd></div>
  </dl>;
}
