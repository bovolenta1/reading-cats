"use client";

import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  count?: number;
};

export default function StarsBackground({ className, count = 80 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    // Cria estrelas
    const stars: Array<{ el: HTMLDivElement; initialY: number; speed: number }> = [];

    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "rc-star";

      const x = Math.random() * 100;
      const y = Math.random() * 100;

      // 30% estáticas (mais “distantes”)
      const isStatic = Math.random() < 0.3;
      const speed = isStatic ? 0 : 0.2 + Math.random() * 0.6;

      const size = isStatic ? 1 + Math.random() : 1 + Math.random() * 2;

      s.style.left = `${x}%`;
      s.style.top = `${y}%`;
      s.style.width = `${size}px`;
      s.style.height = `${size}px`;

      // twinkle
      s.style.setProperty("--duration", `${2 + Math.random() * 4}s`);
      s.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(s);
      stars.push({ el: s, initialY: y, speed });
    }

    // Scroll + “velocidade” (sem Lenis)
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let velocity = 0;

    const tick = (t: number) => {
      const scrollY = window.scrollY;
      const dt = Math.max(16, t - lastTime); // evita dt muito pequeno
      const dy = scrollY - lastScrollY;

      // pixels/ms -> escala aproximada (cap)
      velocity = Math.max(-40, Math.min(40, (dy / dt) * 1200));

      const stretch = Math.max(1, Math.min(1 + Math.abs(velocity) * 0.15, 4));

      stars.forEach((star) => {
        if (star.speed === 0) {
          star.el.style.transform = "scaleY(1)";
          return;
        }

        // parecido com o pen: movimenta e “wrap”
        let pos = (star.initialY - (scrollY * star.speed * 0.05)) % 100;
        if (pos < 0) pos += 100;

        star.el.style.top = `${pos}%`;
        star.el.style.transform = `scaleY(${stretch})`;
      });

      lastScrollY = scrollY;
      lastTime = t;

      requestAnimationFrame(tick);
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [count]);

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
