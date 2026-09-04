'use client'

import { cn } from '@/lib/utils'
import { RISK_META, type RiskLevel } from '@/lib/disaster-data'

const RISK_TEXT: Record<RiskLevel, string> = {
  safe: 'text-safe',
  caution: 'text-caution',
  elevated: 'text-elevated',
  critical: 'text-critical',
}
const RISK_BG: Record<RiskLevel, string> = {
  safe: 'bg-safe/12 text-safe ring-safe/30',
  caution: 'bg-caution/12 text-caution ring-caution/30',
  elevated: 'bg-elevated/12 text-elevated ring-elevated/30',
  critical: 'bg-critical/15 text-critical ring-critical/40',
}
const RISK_DOT: Record<RiskLevel, string> = {
  safe: 'bg-safe',
  caution: 'bg-caution',
  elevated: 'bg-elevated',
  critical: 'bg-critical',
}

export function riskText(level: RiskLevel) {
  return RISK_TEXT[level]
}
export function riskDot(level: RiskLevel) {
  return RISK_DOT[level]
}

/** Frosted command-center surface. */
export function Panel({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-md border border-panel-border bg-panel shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function PanelHeader({
  title,
  right,
  icon,
}: {
  title: string
  right?: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between border-b border-panel-border px-3 py-2">
      <div className="flex items-center gap-2">
        {icon ? <span className="text-primary [&>svg]:size-3.5">{icon}</span> : null}
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h2>
      </div>
      {right}
    </div>
  )
}

export function HazardBadge({
  level,
  className,
  pulse,
}: {
  level: RiskLevel
  className?: string
  pulse?: boolean
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset',
        RISK_BG[level],
        className,
      )}
    >
      <span className="relative flex size-1.5">
        {pulse && level === 'critical' ? (
          <span
            className={cn(
              'absolute inline-flex size-full animate-ping rounded-full opacity-75',
              RISK_DOT[level],
            )}
          />
        ) : null}
        <span className={cn('relative inline-flex size-1.5 rounded-full', RISK_DOT[level])} />
      </span>
      {RISK_META[level].label}
    </span>
  )
}

export function StatusDot({
  status,
}: {
  status: 'online' | 'degraded' | 'offline'
}) {
  const map = {
    online: 'bg-safe shadow-[0_0_6px_var(--color-safe)]',
    degraded: 'bg-caution shadow-[0_0_6px_var(--color-caution)]',
    offline: 'bg-muted-foreground/50',
  }
  return <span className={cn('size-1.5 rounded-full', map[status])} />
}

/** Lightweight inline SVG sparkline. */
export function Sparkline({
  data,
  color = 'var(--color-primary)',
  height = 28,
  width = 96,
  fill = true,
}: {
  data: number[]
  color?: string
  height?: number
  width?: number
  fill?: boolean
}) {
  if (data.length < 2) return <svg width={width} height={height} />
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const stepX = width / (data.length - 1)
  const pts = data.map((d, i) => {
    const x = i * stepX
    const y = height - ((d - min) / span) * (height - 4) - 2
    return [x, y] as const
  })
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`
  const gid = `spark-${color.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && (
        <>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.28" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${gid})`} />
        </>
      )}
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={2} fill={color} />
    </svg>
  )
}

/** Radial ring gauge for flood probability. */
export function RingGauge({
  value,
  size = 148,
  stroke = 10,
  color,
  label,
  sub,
}: {
  value: number
  size?: number
  stroke?: number
  color: string
  label: string
  sub?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const dash = (value / 100) * c
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-panel-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
          style={{
            transition: 'stroke-dasharray 0.9s cubic-bezier(0.4,0,0.2,1)',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-4xl font-semibold tabular-nums leading-none" style={{ color }}>
          {label}
        </span>
        {sub ? (
          <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  )
}
