import React from 'react';

type ProgressBarProps = {
  value: number; // 0..100
  heightClassName?: string; // ex: 'h-3' | 'h-2'
  trackClassName?: string;
  fillClassName?: string;
  roundedClassName?: string; // ex: 'rounded-full'
  ariaLabel?: string;
};

export default function ProgressBar({
  value,
  heightClassName = 'h-3',
  trackClassName = 'bg-white/10 ring-1 ring-white/10',
  fillClassName,
  roundedClassName = 'rounded-full',
  ariaLabel = 'Progress',
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));

  return (
    <div
      className={`relative w-full overflow-visible ${roundedClassName} ${heightClassName} ${trackClassName}`}
      role='progressbar'
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
    >
      <div className={`relative h-full ${roundedClassName} transition-[width] duration-700 ease-out overflow-visible`} style={{ width: `${v}%` }}>
        {/* Fill com shadow */}
        <div
          className={['absolute inset-0', roundedClassName, fillClassName ?? 'bg-gradient-to-r from-amber-300 via-lime-300 to-[#39FF14]'].join(' ')}
          style={{
            boxShadow:
              v > 0
                ? `0 0 5px rgba(57, 255, 20, ${v >= 100 ? 0.8 : v >= 50 ? 0.6 : 0.4}), 0 0 10px rgba(57, 255, 20, ${v >= 100 ? 0.5 : v >= 50 ? 0.3 : 0.15})`
                : 'none',
          }}
        />

        {/* Glow blur static */}
        <div
          className={['absolute inset-0', roundedClassName, fillClassName ?? 'bg-gradient-to-r from-amber-300 via-lime-300 to-[#39FF14]'].join(' ')}
          style={{
            filter: 'blur(2px)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* inset ring */}
      <div className={`pointer-events-none absolute inset-0 ${roundedClassName} ring-1 ring-inset ring-white/10`} />
    </div>
  );
}
