'use client'

import { CloudRain, Droplets, Mountain, Waves } from 'lucide-react'
import type { LiveMetrics } from '@/lib/service'
import { Sparkline } from './hud'

export interface MetricHistories {
  rainfall: number[]
  soilMoisture: number[]
  slopeStability: number[]
  riverLevel: number[]
  floodProbability: number[]
}

type Tone = 'safe' | 'caution' | 'elevated' | 'critical'
const toneColor: Record<Tone, string> = {
  safe: 'var(--color-safe)',
  caution: 'var(--color-caution)',
  elevated: 'var(--color-elevated)',
  critical: 'var(--color-critical)',
}

function band(value: number, thresholds: [number, number, number]): Tone {
  const [a, b, c] = thresholds
  if (value >= c) return 'critical'
  if (value >= b) return 'elevated'
  if (value >= a) return 'caution'
  return 'safe'
}

function Metric({
  icon,
  label,
  value,
  unit,
  history,
  tone,
  detail,
  progress,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  history: number[]
  tone: Tone
  detail: string
  progress: number
}) {
  const color = toneColor[tone]
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2.5">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-md ring-1 ring-inset [&>svg]:size-4"
        style={{ background: `${color}18`, color, boxShadow: `inset 0 0 0 1px ${color}30` }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-[10px] tabular-nums" style={{ color }}>
            {detail}
          </span>
        </div>
        <div className="mt-0.5 flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl font-semibold tabular-nums text-foreground">
              {value}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">{unit}</span>
          </div>
          <Sparkline data={history} color={color} width={72} height={24} />
        </div>
        <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.min(100, Math.max(2, progress))}%`, background: color }}
          />
        </div>
      </div>
    </div>
  )
}

export function MetricsBar({
  metrics,
  histories,
}: {
  metrics: LiveMetrics
  histories: MetricHistories
}) {
  const rainTone = band(metrics.rainfall, [30, 50, 70])
  const soilTone = band(metrics.soilMoisture, [70, 82, 90])
  // Lower stability = worse, invert
  const slopeTone: Tone =
    metrics.slopeStability >= 55
      ? 'safe'
      : metrics.slopeStability >= 40
        ? 'caution'
        : metrics.slopeStability >= 30
          ? 'elevated'
          : 'critical'
  const riverPct = (metrics.riverLevel / metrics.riverDanger) * 100
  const riverTone: Tone =
    riverPct >= 95 ? 'critical' : riverPct >= 85 ? 'elevated' : riverPct >= 70 ? 'caution' : 'safe'

  return (
    <div className="flex items-stretch divide-x divide-panel-border overflow-x-auto">
      <div className="flex w-28 shrink-0 flex-col justify-center gap-1 px-3 py-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Telemetry
        </span>
        <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-caution">
          Simulated
        </span>
      </div>
      <Metric
        icon={<CloudRain />}
        label="Rainfall Intensity"
        value={metrics.rainfall.toFixed(0)}
        unit="mm/h"
        history={histories.rainfall}
        tone={rainTone}
        detail={rainTone === 'critical' ? 'CLOUDBURST' : 'accumulating'}
        progress={(metrics.rainfall / 80) * 100}
      />
      <Metric
        icon={<Droplets />}
        label="Soil Moisture"
        value={metrics.soilMoisture.toFixed(0)}
        unit="%VWC"
        history={histories.soilMoisture}
        tone={soilTone}
        detail={metrics.soilMoisture >= 90 ? 'SATURATED' : 'wetting'}
        progress={metrics.soilMoisture}
      />
      <Metric
        icon={<Mountain />}
        label="Slope Stability"
        value={metrics.slopeStability.toFixed(0)}
        unit="/100"
        history={histories.slopeStability}
        tone={slopeTone}
        detail={slopeTone === 'critical' || slopeTone === 'elevated' ? 'CREEPING' : 'stable'}
        progress={metrics.slopeStability}
      />
      <Metric
        icon={<Waves />}
        label="River Level"
        value={metrics.riverLevel.toFixed(2)}
        unit={`m / ${metrics.riverDanger.toFixed(1)}m`}
        history={histories.riverLevel}
        tone={riverTone}
        detail={`${riverPct.toFixed(0)}% of danger`}
        progress={riverPct}
      />
    </div>
  )
}
