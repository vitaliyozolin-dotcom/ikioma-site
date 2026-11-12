"use client";

/* eslint-disable @next/next/no-img-element -- vector source is shared with the cover */

import { useEffect, useRef, useState } from "react";

const rooms = [
  { id: "living", title: "Кухня-гостиная", short: "Кухня-гостиная", area: "22,2", x: 504, y: 190, path: "M406.57 133.22H598.71V354.54H333.57V259.24H406.57Z", description: "Г-образная комната для кухни, обеденного стола и зоны отдыха." },
  { id: "bed-1", title: "Спальня 1", short: "Спальня", area: "11,8", x: 120, y: 190, path: "M48.22 133.22H194.68V259.24H227.75V303.46H48.22Z", description: "Отдельная спальня с входом из холла." },
  { id: "bed-2", title: "Спальня 2", short: "Спальня", area: "10,8", x: 300, y: 190, path: "M199.17 133.22H402.08V252.39H199.17Z", description: "Комнату можно использовать как спальню или кабинет." },
  { id: "bed-3", title: "Спальня 3", short: "Спальня", area: "13,7", x: 138, y: 418, path: "M48.22 310.32H227.75V480.56H48.22Z", description: "Самая большая из трёх спален, с входом из холла." },
  { id: "hall", title: "Холл", short: "Холл", area: "4,1", x: 280, y: 300, path: "M232.24 259.24H329.09V354.54H232.24Z", description: "Связывает спальни, санузел и общую зону." },
  { id: "bath", title: "Санузел", short: "Санузел", area: "5,2", x: 280, y: 418, path: "M232.24 361.39H329.09V480.56H232.24Z", description: "Один санузел с входом из холла." },
  { id: "utility", title: "Техническое помещение", short: "Техпомещение", area: "5,0", x: 380, y: 418, path: "M333.57 361.39H428.06V480.56H333.57Z", description: "Отдельное место для инженерного оборудования. Состав оборудования согласуется в смете." },
  { id: "entry", title: "Прихожая", short: "Прихожая", area: "8,9", x: 516, y: 418, path: "M432.55 361.39H598.71V480.56H432.55Z", description: "Входная зона с местом для обуви и верхней одежды." },
  { id: "terrace", title: "Терраса", short: "Терраса", area: "22,2", x: 678, y: 300, path: "M606.93 131.85H748.66V481.93H606.93Z", description: "Площадка на открытом воздухе для стола и кресел. Площадь террасы указана отдельно от внутренних помещений." },
] as const;

function Furniture() {
  return <g className="vl-furniture" aria-hidden="true" fill="#c3ab90" stroke="#7a6857" strokeWidth="1">
    {[ [65, 150], [212, 148], [65, 330] ].map(([x,y]) => <g key={x + "-" + y} transform={`translate(${x} ${y})`}>
      <rect width="59" height="65" rx="3" /><rect x="5" y="5" width="23" height="15" rx="3" fill="#fff9ed" /><rect x="31" y="5" width="23" height="15" rx="3" fill="#fff9ed" />
      <path d="M0 25h59" /><rect x="65" y="1" width="14" height="18" rx="1" />
    </g>)}
    <path d="M419 145h112v18h-94v59h-18z" /><path d="M452 145v18m23-18v18m25-18v18m-81 28h18" />
    <rect x="474" y="264" width="57" height="36" rx="16" fill="#d6c1a5" />
    <rect x="487" y="250" width="15" height="10" rx="3" /><rect x="507" y="250" width="15" height="10" rx="3" />
    <rect x="487" y="304" width="15" height="10" rx="3" /><rect x="507" y="304" width="15" height="10" rx="3" />
    <rect x="553" y="184" width="32" height="56" rx="5" fill="#d8ccbb" /><path d="M558 189h22v46h-22zM558 212h22" fill="none" />
    <rect x="241" y="430" width="32" height="42" rx="3" fill="#f7f3eb" /><circle cx="304" cy="456" r="8" fill="#f7f3eb" />
    <rect x="443" y="369" width="76" height="18" rx="2" /><path d="M465 369v18m23-18v18" />
    <rect x="651" y="335" width="46" height="64" rx="14" /><rect x="636" y="354" width="11" height="24" rx="3" /><rect x="701" y="354" width="11" height="24" rx="3" />
  </g>;
}

export default function VelaPlan() {
  const [selected, setSelected] = useState<string>(rooms[0].id);
  const [hover, setHover] = useState<string | null>(null);
  const [furniture, setFurniture] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(100);
  const dialog = useRef<HTMLDialogElement>(null);
  const room = rooms.find(item => item.id === (hover ?? selected)) ?? rooms[0];

  useEffect(() => {
    if (expanded && !dialog.current?.open) dialog.current?.showModal();
    if (!expanded && dialog.current?.open) dialog.current.close();
  }, [expanded]);

  function drawing(isExpanded: boolean) {
    return <div className="vl-drawing" style={isExpanded ? { width: zoom + "%" } : undefined}>
      <img src="/vela/plan.svg" alt="Утверждённая планировка ВЕЛА" width="709" height="364" loading="lazy" />
      <svg viewBox="40 125 708.662 363.78" className="vl-drawing-overlay" aria-label="Выбор помещения на плане">
        {rooms.map(item => <path key={item.id} data-room={item.id} className={room.id === item.id ? "is-active" : ""} d={item.path}
          onPointerEnter={event => { if (event.pointerType === "mouse") setHover(item.id); }}
          onPointerLeave={() => setHover(null)} onClick={() => { setSelected(item.id); setHover(null); }} />)}
        {furniture && <Furniture />}
        {!furniture && <g className="vl-plan-labels" aria-hidden="true">
          {rooms.map(item => <text key={item.id} x={item.x} y={item.y} textAnchor="middle">
            <tspan>{item.short}</tspan><tspan x={item.x} dy="15">{item.area} м²</tspan>
          </text>)}
        </g>}
      </svg>
    </div>;
  }

  return <section className="vl-section vl-wrap" id="plan" aria-labelledby="plan-title">
    <div className="vl-section-heading">
      <div><p className="vl-kicker">Планировка</p><h2 id="plan-title">Все комнаты <em>на одном этаже</em></h2></div>
      <p>Три спальни, кухня-гостиная 22,2 м², отдельное техническое помещение и терраса. Выберите комнату на плане или в списке.</p>
    </div>
    <div className="vl-plan-card">
      <div className="vl-plan-content">
        <div className="vl-plan-toolbar">
          <div className="vl-segment" aria-label="Вид планировки">
            <button type="button" aria-pressed={!furniture} onClick={() => setFurniture(false)}>План</button>
            <button type="button" aria-pressed={furniture} onClick={() => setFurniture(true)}>С мебелью</button>
          </div>
          <button type="button" className="vl-text-button" onClick={() => { setHover(null); setZoom(100); setExpanded(true); }}>Увеличить <span aria-hidden="true">+</span></button>
        </div>
        <div className="vl-plan-sheet">{drawing(false)}</div>
        <div className="vl-plan-download"><a href="/vela/plan.pdf" download>Скачать планировку PDF</a>{furniture && <span>Вариант расстановки мебели</span>}</div>
      </div>
      <div className="vl-room-panel">
        <div className="vl-room-details" aria-live={hover ? "off" : "polite"}><p>{room.title}</p><strong>{room.area} <small>м²</small></strong><span>{room.description}</span></div>
        <ul className="vl-room-list">{rooms.map(item => <li key={item.id}><button type="button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setHover(null); }}><span>{item.title}</span><span>{item.area} м²</span></button></li>)}</ul>
      </div>
    </div>
    <dialog ref={dialog} className="vl-dialog vl-plan-dialog" aria-labelledby="plan-dialog-title" onClose={() => { setExpanded(false); setHover(null); }}>
      {expanded && <><div className="vl-dialog-heading"><h2 id="plan-dialog-title">Планировка ВЕЛА</h2><button type="button" className="vl-icon-button" aria-label="Закрыть планировку" onClick={() => setExpanded(false)}>×</button></div>
        <div className="vl-plan-zoom"><label htmlFor="vela-plan-zoom">Масштаб <strong>{zoom}%</strong></label><input id="vela-plan-zoom" type="range" min="100" max="250" step="5" value={zoom} onChange={event => setZoom(Number(event.target.value))} /></div>
        <div className="vl-plan-pan">{drawing(true)}</div><p className="vl-plan-dialog-detail">{room.title} · {room.area} м²</p></>}
    </dialog>
  </section>;
}
