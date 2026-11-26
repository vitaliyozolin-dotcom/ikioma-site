"use client";

/* eslint-disable @next/next/no-img-element -- the plan is a vector export of the approved drawing */

import { useEffect, useRef, useState } from "react";

const rooms = [
  { id: "living", title: "Кухня-гостиная", area: "22,2", path: "M406.57 133.22H598.71V354.54H333.57V259.24H406.57Z", description: "Г-образная комната для кухни, обеденного стола и зоны отдыха." },
  { id: "bed-1", title: "Спальня 1", area: "11,8", path: "M48.22 133.22H194.68V259.24H227.75V303.46H48.22Z", description: "Отдельная спальня с входом из холла." },
  { id: "bed-2", title: "Спальня 2", area: "10,8", path: "M199.17 133.22H402.08V252.39H199.17Z", description: "Комнату можно использовать как спальню или кабинет." },
  { id: "bed-3", title: "Спальня 3", area: "13,7", path: "M48.22 310.32H227.75V480.56H48.22Z", description: "Самая большая из трёх спален, с входом из холла." },
  { id: "hall", title: "Холл", area: "4,1", path: "M232.24 259.24H329.09V354.54H232.24Z", description: "Связывает спальни, санузел и общую зону." },
  { id: "bath", title: "Санузел", area: "5,2", path: "M232.24 361.39H329.09V480.56H232.24Z", description: "Один санузел с входом из холла." },
  { id: "utility", title: "Техническое помещение", area: "5", path: "M333.57 361.39H428.06V480.56H333.57Z", description: "Отдельное место для инженерного оборудования. Состав оборудования согласуется в смете." },
  { id: "entry", title: "Прихожая", area: "8,9", path: "M432.55 361.39H598.71V480.56H432.55Z", description: "Входная зона с местом для обуви и верхней одежды." },
  { id: "terrace", title: "Терраса", area: "22,2", path: "M606.93 131.85H748.66V481.93H606.93Z", description: "Площадка на открытом воздухе для стола и кресел. Площадь террасы указана отдельно от внутренних помещений." },
] as const;

export default function VelaPlan() {
  const [selected, setSelected] = useState<string>(rooms[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [furnished, setFurnished] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const room = rooms.find(item => item.id === (hover ?? selected)) ?? rooms[0];

  useEffect(() => {
    if (expanded && !dialog.current?.open) dialog.current?.showModal();
    if (!expanded && dialog.current?.open) dialog.current.close();
  }, [expanded]);

  function drawing(isExpanded: boolean) {
    return <div className="vl-drawing" style={isExpanded ? { width: zoom + "%" } : undefined}>
      <img src={furnished ? "/vela/plan-furnished.webp" : "/vela/plan.svg"} alt={furnished ? "Планировка ВЕЛА с мебелью" : "Планировка ВЕЛА без мебели"} width="709" height="364" loading="lazy" />
      <svg viewBox="40 125 708.662 363.78" className="vl-drawing-overlay" aria-label="Выбор помещения на плане">
        {rooms.map(item => <path key={item.id} data-room={item.id} className={room.id === item.id ? "is-active" : ""} d={item.path}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHover(item.id); }}
          onPointerLeave={() => setHover(null)} onClick={() => { setSelected(item.id); setHover(null); }} />)}
      </svg>
    </div>;
  }

  function planOptions() {
    return <div className="vl-plan-options" role="group" aria-label="Вариант планировки">
      <button type="button" aria-pressed={!furnished} onClick={() => setFurnished(false)}>Без мебели</button>
      <button type="button" aria-pressed={furnished} onClick={() => setFurnished(true)}>С мебелью</button>
    </div>;
  }

  return <section className="vl-section vl-wrap" id="plan" tabIndex={-1} aria-labelledby="plan-title">
    <div className="vl-section-heading">
      <div><p className="vl-kicker">Планировка</p><h2 id="plan-title">Все комнаты <em>на одном этаже</em></h2></div>
      <p>Холл отделяет спальни от общей зоны. В кухне-гостиной можно собираться всей семьёй, а летом накрывать стол на крытой террасе.</p>
    </div>
    <p className="vl-plan-flex">Планировку можно адаптировать: изменения стен, проёмов и инженерии сначала проверяет проектировщик. Возможность, стоимость и сроки согласуем до начала работ.</p>
    <div className="vl-plan-card">
      <div className="vl-plan-content">
        {planOptions()}
        <div className="vl-plan-toolbar">
          <button type="button" className="vl-text-button" onClick={() => { setHover(null); setZoom(100); setExpanded(true); }}>Увеличить <span aria-hidden="true">+</span></button>
          <a className="vl-plan-pdf" href={furnished ? "/vela/plan-furnished.webp" : "/vela/plan.pdf"} download>{furnished ? "Скачать планировку с мебелью" : "Скачать планировку PDF"}</a>
        </div>
        <div className="vl-plan-sheet">{drawing(false)}</div>
      </div>
      <div className="vl-room-panel">
        <div className="vl-room-details" aria-live={hover ? "off" : "polite"}><p>{room.title}</p><strong>{room.area} <small>м²</small></strong><span>{room.description}</span></div>
        <ul className="vl-room-list">{rooms.map(item => <li key={item.id}><button type="button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setHover(null); }}><span>{item.title}</span><span>{item.area} м²</span></button></li>)}</ul>
      </div>
    </div>
    <dialog ref={dialog} className="vl-dialog vl-plan-dialog" aria-labelledby="plan-dialog-title" onClose={() => { setExpanded(false); setHover(null); }}>
      {expanded && <><div className="vl-dialog-heading"><h2 id="plan-dialog-title">Планировка ВЕЛА</h2><button type="button" className="vl-icon-button" aria-label="Закрыть планировку" onClick={() => setExpanded(false)}>×</button></div>
        {planOptions()}
        <div className="vl-plan-zoom"><label htmlFor="vela-plan-zoom">Масштаб <strong>{zoom}%</strong></label><input id="vela-plan-zoom" type="range" min="100" max="250" step="5" value={zoom} onChange={event => setZoom(Number(event.target.value))} /></div>
        <div className="vl-plan-pan">{drawing(true)}</div><p className="vl-plan-dialog-detail">{room.title} · {room.area} м²</p></>}
    </dialog>
  </section>;
}
