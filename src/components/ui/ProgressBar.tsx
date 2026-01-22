import React from 'react'

type ProgressBarProps = {
  value: number // 0..100
  heightClassName?: string // ex: 'h-3' | 'h-2'
  trackClassName?: string
  fillClassName?: string
  showShine?: boolean
  roundedClassName?: string // ex: 'rounded-full'
  ariaLabel?: string
}

export default function ProgressBar({
  value,
  heightClassName = 'h-3',
  trackClassName = 'bg-white/10 ring-1 ring-white/10',
  fillClassName,
  showShine = true,
  roundedClassName = 'rounded-full',
  ariaLabel = 'Progress',
}: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value))

  return (
    <div
      className={`relative w-full overflow-hidden ${roundedClassName} ${heightClassName} ${trackClassName}`}
      role='progressbar'
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
    >
      <div
        className={`relative h-full ${roundedClassName} transition-[width] duration-700 ease-out`}
        style={{ width: `${v}%` }}
      >
        {/* Fill */}
        <div
          className={[
            'absolute inset-0',
            roundedClassName,
            fillClassName ?? 'bg-gradient-to-r from-amber-300 via-lime-300 to-[#39FF14]',
          ].join(' ')}
        />

        {/* Glow */}
        <div
          className={[
            'absolute inset-0',
            roundedClassName,
            fillClassName ?? 'bg-gradient-to-r from-amber-300 via-lime-300 to-[#39FF14]',
            'opacity-60 blur-[6px]',
          ].join(' ')}
        />

        {/* Shine */}
        {showShine ? (
          <div
            className='absolute inset-0 opacity-60 animate-rc-shine'
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 45%, transparent 70%)',
            }}
          />
        ) : null}
      </div>

      {/* inset ring */}
      <div className={`pointer-events-none absolute inset-0 ${roundedClassName} ring-1 ring-inset ring-white/10`} />
    </div>
  )
}
