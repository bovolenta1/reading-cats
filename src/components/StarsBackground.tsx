"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  count?: number;
  density?: number; // 1 = normal, 1.5 = mais estrelas, 2 = bem mais
};

type StarRec = {
  el: HTMLDivElement;
  initialY: number;
  speed: number;
};

export default function StarsBackground({
  className,
  count = 80,
  density = 1.8,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const stars: StarRec[] = [];

    // 3 camadas: fundo (muitas, pequenas), meio, frente (poucas, maiores)
    const layers = [
      { portion: 0.68, staticChance: 0.40, speedMin: 0.05, speedMax: 0.25, sizeMin: 0.8, sizeMax: 1.6, opacityMin: 0.35, opacityMax: 0.65 },
      { portion: 0.24, staticChance: 0.25, speedMin: 0.20, speedMax: 0.55, sizeMin: 1.2, sizeMax: 2.2, opacityMin: 0.45, opacityMax: 0.80 },
      { portion: 0.08, staticChance: 0.10, speedMin: 0.50, speedMax: 0.90, sizeMin: 1.8, sizeMax: 3.2, opacityMin: 0.55, opacityMax: 0.95 },
    ] as const;

    // total com densidade, mas com teto pra performance
    const desired = Math.round(count * density);
    const maxStars = 250; // ajuste se quiser
    const total = Math.min(desired, maxStars);

    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let created = 0;

    for (const layer of layers) {
      const layerCount =
        layer === layers[layers.length - 1]
          ? total - created
          : Math.floor(total * layer.portion);

      for (let i = 0; i < layerCount; i++) {
        const s = document.createElement("div");

        // 8% sparkle (cruzinha) espalhada
        const sparkle = Math.random() < 0.08;
        s.className = sparkle ? "rc-star rc-sparkle" : "rc-star";

        const x = Math.random() * 100;
        const y = Math.random() * 100;

        const isStatic = Math.random() < layer.staticChance;
        const speed = isStatic ? 0 : rand(layer.speedMin, layer.speedMax);

        const size = rand(layer.sizeMin, layer.sizeMax);
        const opacity = rand(layer.opacityMin, layer.opacityMax);

        s.style.left = `${x}%`;
        s.style.top = `${y}%`;
        s.style.width = `${size}px`;
        s.style.height = `${size}px`;
        s.style.opacity = `${opacity}`;

        // twinkle
        s.style.setProperty("--duration", `${rand(2.0, 5.5)}s`);
        s.style.animationDelay = `${rand(0, 6)}s`;

        // sparkle mais lento e raro
        if (sparkle) {
          s.style.setProperty("--sparkleDuration", `${rand(2.8, 6.5)}s`);
        }

        container.appendChild(s);
        stars.push({ el: s, initialY: y, speed });
        created++;
      }
    }

    // Scroll “parallax”
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;

    const tick = (t: number) => {
      const scrollY = window.scrollY;
      const dt = Math.max(16, t - lastTime);
      const dy = scrollY - lastScrollY;

      velocity = Math.max(-40, Math.min(40, (dy / dt) * 1200));
      const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.12, 3.2));

      for (const star of stars) {
        if (star.speed === 0) {
          star.el.style.transform = "scaleY(1)";
          continue;
        }

        let pos = (star.initialY - (scrollY * star.speed * 0.06)) % 100;
        if (pos < 0) pos += 100;

        star.el.style.top = `${pos}%`;
        star.el.style.transform = `scaleY(${stretch})`;
      }

      lastScrollY = scrollY;
      lastTime = t;

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [count, density]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={[
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        className ?? "",
      ].join(" ")}
    />
  );
}
