"use client";

/* eslint-disable @next/next/no-img-element -- responsive local assets are encoded ahead of time */

import { useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

export type VelaView = {
  src: string;
  small?: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
  label?: string;
  note?: string;
};

export function VelaMedia({ view, sizes, priority = false }: { view: VelaView; sizes: string; priority?: boolean }) {
  return <img src={view.src} srcSet={view.small ? `${view.small} 760w, ${view.src} ${view.width}w` : undefined}
    sizes={view.small ? sizes : undefined} alt={view.alt} width={view.width ?? 900} height={view.height ?? 950}
    fetchPriority={priority ? "high" : undefined} loading={priority ? undefined : "lazy"} decoding={priority ? undefined : "async"} />;
}

export function FrameIcon({ expand = false }: { expand?: boolean }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.55" className="vl-arrow">
    {expand ? <path d="M13 4h7v7m0-7-6 6M11 20H4v-7m0 7 6-6" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
  </svg>;
}

export type OpenGallery = (items: VelaView[], initial: number, trigger: HTMLButtonElement) => void;

export function ArchitectureGallery({ items, open }: { items: VelaView[]; open: OpenGallery }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const view = items[active];
  return <section className="vl-architecture-band" id="architecture" aria-labelledby="vl-architecture-title">
    <div className="vl-section vl-wrap">
      <div className="vl-section-heading">
        <h2 id="vl-architecture-title">Фасад, терраса <em>и интерьер</em></h2>
        <p>3D-эскизы по плану ВЕЛА. Варианты отделки, мебели и благоустройства показаны для примера.</p>
      </div>
      <div className="vl-viewer">
        <figure className="vl-viewer-main">
          <button type="button" className="vl-image-trigger" aria-label={"Увеличить: " + view.caption} onClick={event => open(items, active, event.currentTarget)}>
            <VelaMedia view={view} sizes="(max-width: 700px) 100vw, (max-width: 1300px) 68vw, 900px" />
            <span className="vl-enlarge" aria-hidden="true"><FrameIcon expand /></span>
          </button>
          <figcaption>{view.caption}</figcaption>
        </figure>
        <div className="vl-viewer-side">
          <div className="vl-view-select" role="group" aria-label="Ракурсы ВЕЛА">
            {items.map((item, index) => <button type="button" key={item.src} className="vl-view-tab" aria-pressed={active === index}
              onClick={() => setActive(index)}><VelaMedia view={{ ...item, alt: "" }} sizes="105px" /><span>{item.label}</span></button>)}
          </div>
          <p aria-live="polite">{view.note}</p>
        </div>
      </div>
    </div>
  </section>;
}

export type GalleryState = { items: VelaView[]; index: number; trigger: HTMLButtonElement } | null;

export function GalleryDialog({ gallery, setGallery }: {
  gallery: GalleryState;
  setGallery: Dispatch<SetStateAction<GalleryState>>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const open = gallery !== null;

  useEffect(() => {
    const node = ref.current;
    if (open && !node?.open) node?.showModal();
  }, [open]);

  function dismiss() {
    ref.current?.close();
    gallery?.trigger.focus({ preventScroll: true });
    setGallery(null);
  }

  function step(direction: number) {
    setGallery(current => current && { ...current, index: (current.index + direction + current.items.length) % current.items.length });
  }

  const item = gallery?.items[gallery.index];
  return <dialog ref={ref} className="vl-dialog vl-gallery-dialog" aria-labelledby="vl-gallery-title" onCancel={event => { event.preventDefault(); dismiss(); }} onKeyDown={event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      step(event.key === "ArrowLeft" ? -1 : 1);
    }
  }}>
    {gallery && item && <>
      <div className="vl-dialog-heading"><h2 id="vl-gallery-title">{item.label ?? "Стройка в Келози"}</h2><button type="button" className="vl-icon-button" aria-label="Закрыть галерею" onClick={dismiss}>×</button></div>
      <figure onTouchStart={event => { const p = event.touches[0]; touch.current = { x: p.clientX, y: p.clientY }; }} onTouchEnd={event => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const end = event.changedTouches[0];
        const distance = end.clientX - start.x;
        if (Math.abs(distance) > 45 && Math.abs(end.clientY - start.y) < Math.abs(distance) / 2) step(distance > 0 ? -1 : 1);
      }}>
        <VelaMedia view={item} sizes="(max-width: 700px) 100vw, 950px" />
        <figcaption aria-live="polite">{item.caption}</figcaption>
      </figure>
      {gallery.items.length > 1 && <div className="vl-gallery-controls">
        <button type="button" className="vl-text-button" onClick={() => step(-1)}>Предыдущее фото</button>
        <span aria-hidden="true">{gallery.index + 1} / {gallery.items.length}</span>
        <button type="button" className="vl-text-button" onClick={() => step(1)}>Следующее фото</button>
      </div>}
    </>}
  </dialog>;
}

export function ConstructionPhotos({ items, open, action }: { items: VelaView[]; open: OpenGallery; action: ReactNode }) {
  if (!items.length) return null;
  return <section className="vl-section vl-wrap vl-project-proof" aria-labelledby="vl-construction-title">
    <div className="vl-section-heading">
      <div><p className="vl-kicker">Объект ИКИОМА</p><h2 id="vl-construction-title">Стройка <em>в Келози</em></h2></div>
      <div><p>Фотографии от 2 октября 2026 года. Вид со стороны участка и терраса на этапе монтажа.</p>{action}</div>
    </div>
    <div className="vl-photos">{items.map((item, index) => <figure key={item.src}>
      <button type="button" className="vl-image-trigger" aria-label={"Увеличить: " + item.caption} onClick={event => open(items, index, event.currentTarget)}>
        <VelaMedia view={item} sizes="(max-width: 700px) 100vw, 52vw" /><span className="vl-enlarge" aria-hidden="true"><FrameIcon expand /></span>
      </button>
      <figcaption>{item.caption}</figcaption>
    </figure>)}</div>
  </section>;
}
