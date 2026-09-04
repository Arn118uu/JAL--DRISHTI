'use client'

import { DATA_MODE, type CommandKpis } from '@/lib/service'

type Kpis = CommandKpis

function Card({
  label,
  value,
  unit,
  tone,
}: {
  label: string
  value: string
  unit?: string
  tone?: 'critical' | 'caution' | 'safe' | 'primary'
}) {
  const color =
    tone === 'critical'
      ? 'text-critical'
      : tone === 'caution'
        ? 'text-caution'
        : tone === 'safe'
          ? 'text-safe'
          : 'text-primary'
  return (
    <div className="min-w-[7.5rem] flex-1 rounded-md border border-panel-border bg-panel px-2.5 py-1.5">
      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className={`font-mono text-base font-semibold tabular-nums ${color}`}>{value}</span>
        {unit ? <span className="font-mono text-[9px] text-muted-foreground">{unit}</span> : null}
      </div>
    </div>
  )
}

export function KpiStrip({ kpis }: { kpis: Kpis }) {
  return (
    <div className="shrink-0 border-b border-panel-border bg-background/80 px-3 py-2">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Command metrics
        </span>
        <span className="font-mono text-[8px] uppercase tracking-wider text-caution">{DATA_MODE}</span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto">
        <Card label="Active Alerts" value={String(kpis.activeAlerts)} tone="critical" />
        <Card label="High-Risk Settlements" value={String(kpis.highRiskSettlements)} tone="caution" />
        <Card label="People at Risk" value={kpis.peopleAtRisk.toLocaleString('en-IN')} />
        <Card
          label="Avg Flood Probability"
          value={kpis.avgFloodProbability.toFixed(0)}
          unit="%"
          tone="caution"
        />
        <Card label="Critical Sensors" value={String(kpis.criticalSensors)} />
        <Card
          label="Estimated Lead Time"
          value={kpis.leadTimeMin == null ? '—' : String(kpis.leadTimeMin)}
          unit="min"
        />
        <Card
          label="Rainfall Intensity"
          value={kpis.rainfall == null ? '—' : kpis.rainfall.toFixed(0)}
          unit="mm/h"
        />
        <Card
          label="River Level"
          value={kpis.riverLevel == null ? '—' : kpis.riverLevel.toFixed(1)}
          unit="m"
        />
        <Card label="Glaciers Monitored" value={String(kpis.glaciersMonitored)} />
        <Card label="High-Risk Glaciers" value={String(kpis.highRiskGlaciers)} tone="caution" />
        <Card label="Lakes / Water Bodies" value={String(kpis.lakesMonitored)} />
        <Card label="High-Level Water Bodies" value={String(kpis.highLevelWaterBodies)} tone="critical" />
      </div>
    </div>
  )
}
