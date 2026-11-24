import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { money, type Estimate } from "./vela-calculations";

export async function downloadQuote(quote: Estimate) {
  const response = await fetch("/vela/fonts/noto-sans-report.ttf");
  if (!response.ok) throw new Error("report_font");
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(await response.arrayBuffer(), { subset: true });
  pdf.setTitle("ВЕЛА · Предварительный расчёт");
  pdf.setAuthor("ИКИОМА");
  const [width, height] = [595.28, 841.89];
  const left = 48;
  const ink = rgb(0.12, 0.17, 0.14);
  const muted = rgb(0.32, 0.36, 0.33);
  const accent = rgb(0.59, 0.25, 0.14);
  let page = pdf.addPage([width, height]);
  let y = height - 55;

  function lines(value: string, size = 11, color = ink) {
    const words = value.replace(/[\u00a0\u202f]/g, " ").split(/\s+/);
    let line = "";
    const out: string[] = [];
    for (const word of words) {
      const next = line ? line + " " + word : word;
      if (line && font.widthOfTextAtSize(next, size) > width - left * 2) { out.push(line); line = word; }
      else line = next;
    }
    if (line) out.push(line);
    for (const row of out) {
      if (y < 62) { page = pdf.addPage([width, height]); y = height - 55; }
      page.drawText(row, { x: left, y, size, font, color });
      y -= size * 1.48;
    }
  }

  lines("ИКИОМА / ВЕЛА", 11, accent);
  y -= 18;
  lines("Предварительный расчёт", 27);
  lines("Цены от " + quote.validFrom.split("-").reverse().join(".") + " · Версия " + quote.version, 10, muted);
  y -= 18;
  lines("Рассчитанные позиции", 15);
  quote.known.forEach(item => lines(item.title + " — от " + money(item.price)));
  y -= 10;
  lines("Итого по выбранным ценам · от " + money(quote.total), 18, accent);
  if (quote.pending.length) {
    y -= 18;
    lines("Рассчитываются индивидуально", 15);
    quote.pending.forEach(item => lines(item.title));
  }
  if (quote.omitted.length) {
    y -= 18;
    lines("Работы, которые не выбраны", 15);
    lines(quote.omitted.map(item => item.title).join(", "), 10, muted);
  }
  y -= 17;
  lines("Сумма рассчитана по опубликованным стартовым ценам. Окончательная стоимость зависит от участка, состава работ и спецификации, согласованных с ИКИОМА.", 10, muted);
  lines("ikioma.ru", 11, accent);
  const blob = new Blob([await pdf.save() as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: "IKIOMA_VELA_calculation.pdf" });
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
