'use client'

import { DATA_MODE, getGlacierSummary, getWaterBodySummary } from '@/lib/service'
import { Panel, PanelHeader } from './hud'

export function GlacierSummaryCard({ onView }: { onView: () => void }) {
  const s = getGlacierSummary()
  return (
    <Panel className="min-w-0 flex-1">
      <PanelHeader
        title="Glacier monitoring"
        right={<span className="font-mono text-[8px] text-caution">{DATA_MODE}</span>}
      />
      <div className="grid grid-cols-2 gap-2 p-3">
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">Monitored glaciers</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-foreground">{s.monitored}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">High melt risk</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-caution">{s.highMeltRisk}</div>
        </div>
        <div className="col-span-2">
          <div className="font-mono text-[9px] uppercase text-muted-foreground">Avg melt rate</div>
          <div className="font-mono text-lg font-semibold tabular-nums text-primary">
            {s.avgMeltRate.toFixed(2)} m/day
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onView}
        className="w-full border-t border-panel-border px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/10"
      >
        View details →
      </button>
    </Panel>
  )
}

export function LakeSummaryCard({ onView }: { onView: () => void }) {
  const s = getWaterBodySummary()
  return (
    <Panel className="min-w-0 flex-1">
      <PanelHeader
        title="Lake / water bodies"
        right={<span className="font-mono text-[8px] text-caution">{DATA_MODE}</span>}
      />
      <div className="grid grid-cols-2 gap-2 p-3">
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">Monitored lakes</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-foreground">{s.monitored}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">High-level risk</div>
          <div className="font-mono text-xl font-semibold tabular-nums text-critical">{s.highLevel}</div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">Avg water level</div>
          <div className="font-mono text-lg font-semibold tabular-nums text-primary">
            {s.avgFillPercent.toFixed(0)}%
          </div>
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase text-muted-foreground">High-level water bodies</div>
          <div className="font-mono text-lg font-semibold tabular-nums text-caution">{s.highLevel}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onView}
        className="w-full border-t border-panel-border px-3 py-1.5 text-left font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/10"
      >
        View details →
      </button>
    </Panel>
  )
}
