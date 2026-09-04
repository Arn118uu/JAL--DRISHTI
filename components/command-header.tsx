'use client'

import { Clock } from 'lucide-react'
import { DATA_MODE, type LocationRecord, type RiskLevel } from '@/lib/service'
import { HazardBadge } from './hud'

function fmtClock(d: Date) {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}

export function CommandHeader({
  location,
  threat,
  now,
}: {
  location: LocationRecord | null
  threat: RiskLevel | null
  now: Date | null
}) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-panel-border bg-panel px-4">
      <div className="min-w-0 leading-none">
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm font-bold tracking-[0.14em] text-foreground">
            JAL-DRISHTI
          </span>
          <span className="hidden font-sans text-xs text-muted-foreground sm:inline">
            Flash Flood Prediction System
          </span>
        </div>
        <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {location
            ? `${location.name} · ${location.district}, ${location.state}`
            : 'No monitoring record selected'}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="rounded-sm bg-muted px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-caution ring-1 ring-inset ring-caution/30">
          {DATA_MODE}
        </span>
        <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-[9px] font-semibold tracking-wider text-primary ring-1 ring-inset ring-primary/30">
          SIH26192
        </span>
        {threat ? <HazardBadge level={threat} pulse /> : (
          <span className="font-mono text-[10px] uppercase text-muted-foreground">No data</span>
        )}
        <div className="hidden items-center gap-1.5 border-l border-panel-border pl-2 xl:flex">
          <Clock className="size-3.5 text-muted-foreground" />
          <span className="font-mono text-xs tabular-nums text-foreground">
            {now ? fmtClock(now) : '--:--:--'} IST
          </span>
        </div>
      </div>
    </header>
  )
}
