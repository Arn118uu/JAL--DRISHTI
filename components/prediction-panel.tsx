'use client'

import {
  Gauge,
  Timer,
  BrainCircuit,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react'
import {
  DATA_MODE,
  getEvacuationPlan,
  getFeatureContributions,
  getLocation,
  probabilityLevel,
  type LiveMetrics,
} from '@/lib/service'
import { Panel, PanelHeader, RingGauge } from './hud'
import { cn } from '@/lib/utils'

export function PredictionPanel({
  locationId,
  metrics,
}: {
  locationId: string | null
  metrics: LiveMetrics
}) {
  const loc = getLocation(locationId)
  const level = probabilityLevel(metrics.floodProbability)
  const color = `var(--color-${level})`
  const contributions = getFeatureContributions(locationId, metrics)
  const evacSteps = getEvacuationPlan(locationId)

  if (!loc) return null

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <PanelHeader
          title="Flood Probability Forecast"
          icon={<Gauge />}
          right={
            <span className="font-mono text-[10px] text-muted-foreground">prototype</span>
          }
        />
        <div className="flex items-center gap-4 p-4">
          <RingGauge
            value={metrics.floodProbability}
            color={color}
            label={`${metrics.floodProbability.toFixed(0)}%`}
            sub="12h window"
          />
          <div className="flex flex-1 flex-col gap-2.5">
            <div className="rounded-sm border border-panel-border bg-muted/30 p-2.5">
              <div className="flex items-center gap-1.5">
                <Timer className="size-3.5 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Lead Time
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className="font-mono text-2xl font-semibold tabular-nums"
                  style={{ color }}
                >
                  {metrics.leadTimeMin}
                </span>
                <span className="font-mono text-xs text-muted-foreground">min to onset</span>
              </div>
            </div>
            <div className="rounded-sm border border-panel-border bg-muted/30 p-2.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Model Confidence
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
                  {metrics.confidence.toFixed(0)}%
                </span>
                <span className="font-mono text-xs text-muted-foreground">CI 0.9</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-panel-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span className="text-foreground">{loc.population.toLocaleString('en-IN')}</span> residents
          at {loc.name} · coverage {loc.coverage} · {DATA_MODE}
        </div>
      </Panel>

      <Panel>
        <PanelHeader
          title="Explainable AI · Drivers"
          icon={<BrainCircuit />}
          right={
            <span className="font-mono text-[10px] text-muted-foreground">simulated SHAP</span>
          }
        />
        <div className="flex flex-col gap-2.5 p-3">
          {contributions.map((f) => (
            <div key={f.feature}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 font-sans text-[12px] text-foreground">
                  <ArrowUpRight
                    className={cn(
                      'size-3',
                      f.direction === 'increasing' ? 'text-critical' : 'text-safe rotate-90',
                    )}
                  />
                  {f.feature}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {f.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${Math.min(100, f.contribution * 3)}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right font-mono text-[11px] font-semibold tabular-nums text-primary">
                  {f.contribution}%
                </span>
              </div>
            </div>
          ))}
          <p className="mt-1 rounded-sm border border-panel-border bg-muted/30 p-2 font-sans text-[11px] leading-relaxed text-muted-foreground">
            Prototype driver split for <span className="text-foreground">{loc.name}</span>. Not a
            live model explanation. Historical note: {loc.historicalRisk}
          </p>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Response Recommendations" icon={<Navigation />} />
        <div className="flex flex-col gap-1.5 p-2.5">
          {evacSteps.map((s) => (
            <div
              key={s.order}
              className="rounded-sm border border-panel-border bg-muted/25 p-2.5"
              style={{ borderLeftColor: `var(--color-${s.tone})`, borderLeftWidth: 2 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold"
                  style={{
                    background: `color-mix(in oklch, var(--color-${s.tone}) 16%, transparent)`,
                    color: `var(--color-${s.tone})`,
                  }}
                >
                  {s.order}
                </span>
                <span className="font-sans text-[12px] font-semibold text-foreground">
                  {s.action}
                </span>
              </div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {s.target}
              </div>
              <p className="mt-1 font-sans text-[11px] leading-relaxed text-muted-foreground">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}
