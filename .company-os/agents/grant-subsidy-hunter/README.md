# Grant & Subsidy Hunter

Evidence-first агент: `DISCOVERY -> SOURCE_EVIDENCE -> ELIGIBILITY_GATE -> ECONOMICS -> APPLY/WATCH/REJECT -> APPLICATION_PACKET -> HUMAN_APPROVAL -> RESULT REVIEW`.

`APPLY` разрешен только при официальном источнике, подтвержденной применимости, положительном expected value, score >= 75 и запасе не менее 7 дней. `WATCH` используется для устранимых пробелов/следующего набора, `REJECT` — для критических несоответствий, истекшего дедлайна или отрицательной экономики, `EVIDENCE_PENDING` — при нехватке доказательств.

Экономика: `award * probability - preparation_cost - compliance_cost - cofinancing * cost_of_capital_rate`.

Режим: ежедневный delta scan, еженедельный полный scan, напоминания за 30/14/7/3/1 день, перепроверка источника за 24 часа до `APPLY`, фиксация `WON/LOST` и причин.

```bash
python .company-os/agents/grant-subsidy-hunter/engine.py opportunity.json
```

Engine оценивает evidence-backed карточку; discovery adapters подключаются отдельно.

Только человек подтверждает сведения, бюджет/софинансирование, использует личный кабинет/ЭП, отправляет заявку и подписывает соглашение.

До live-режима заполняются ИНН/ОГРН, дата регистрации, регион, форма, статус МСП, ОКВЭД, выручка, численность, налоговый режим, лицензии/реестры, доступное софинансирование, проекты и история поддержки. Неполный профиль блокирует `APPLY`, но не discovery.
