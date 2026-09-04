'use client'

import { Waves, Radio, Clock, MapPinned } from 'lucide-react'
import {
  DATA_MODE,
  VIEW_PRESETS,
  type LiveMetrics,
  type LocationRecord,
  type MapViewKey,
  type RiskLevel,
} from '@/lib/service'
import { HazardBadge } from './hud'
import { cn } from '@/lib/utils'

function fmtClock(d: Date) {
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Kolkata',
  })
}
function fmtDate(d: Date) {
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })
}

export function TopBar({
  location,
  metrics,
  threat,
  onlineSensors,
  totalSensors,
  now,
  view,
  onView,
}: {
  location: LocationRecord | null
  metrics: LiveMetrics | null
  threat: RiskLevel | null
  onlineSensors: number
  totalSensors: number
  now: Date | null
  view: MapViewKey
  onView: (key: MapViewKey) => void
}) {
  return (
    <header className="pointer-events-auto flex h-14 items-center justify-between gap-4 border-b border-panel-border bg-panel px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative flex size-9 items-center justify-center rounded-md bg-primary/12 ring-1 ring-primary/30">
          <Waves className="size-5 text-primary" />
        </div>
        <div className="leading-none">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-bold tracking-[0.14em] text-foreground">
              JAL&#8209;DRISHTI
            </span>
            <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              v4.2 · NDRF
            </span>
          </div>
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Flash Flood Intelligence Command Center
          </span>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        {VIEW_PRESETS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => onView(p.key)}
            aria-pressed={view === p.key}
            className={cn(
              'rounded-sm px-2 py-1 font-mono text-[10px] tracking-[0.12em] transition-colors',
              view === p.key
                ? 'bg-primary/15 text-primary ring-1 ring-primary/40'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="hidden min-w-0 items-center gap-5 xl:flex">
        <div className="flex min-w-0 flex-col items-start leading-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Selected location
          </span>
          <span className="mt-1 max-w-[16rem] truncate font-sans text-xs font-semibold text-foreground">
            {location ? location.name : 'None — no monitoring record'}
          </span>
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Grid ref
          </span>
          <span className="mt-1 font-mono text-xs text-foreground">
            {location
              ? `${location.coord[0].toFixed(3)}°N ${location.coord[1].toFixed(3)}°E`
              : '—'}
          </span>
        </div>
        <div className="flex flex-col items-start leading-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            District
          </span>
          <span className="mt-1 font-sans text-xs font-semibold text-foreground">
            {location ? `${location.district}, ${location.state}` : '—'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-md bg-muted px-2 py-1 ring-1 ring-inset ring-panel-border md:flex">
          <MapPinned className="size-3 text-muted-foreground" />
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Data mode
          </span>
          <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-caution">
            {DATA_MODE}
          </span>
        </div>

        <div className="hidden items-center gap-1.5 rounded-md bg-muted px-2 py-1 ring-1 ring-inset ring-panel-border sm:flex">
          <Radio className="size-3 text-muted-foreground" />
          <span className="font-mono text-[10px] text-foreground">
            {location ? `${onlineSensors}/${totalSensors} nodes` : '— nodes'}
          </span>
        </div>

        <div className="flex flex-col items-end leading-none">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Threat level
          </span>
          <div className="mt-1">
            {threat && metrics ? (
              <HazardBadge level={threat} pulse />
            ) : (
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                No data
              </span>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-1.5 border-l border-panel-border pl-3 2xl:flex">
          <Clock className="size-3.5 text-muted-foreground" />
          <div className="flex flex-col items-end leading-none">
            <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
              {now ? fmtClock(now) : '--:--:--'} <span className="text-muted-foreground">IST</span>
            </span>
            <span className="mt-0.5 font-mono text-[10px] text-muted-foreground">
              {now ? fmtDate(now) : '— — —'}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
