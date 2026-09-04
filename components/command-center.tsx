'use client'

import { useEffect, useState } from 'react'
import {
  getCommandKpis,
  getDefaultLocationId,
  getGlacierForLocation,
  getLocation,
  getMetrics,
  getWaterBodyForLocation,
  listGlaciers,
  listLocations,
  listWaterBodies,
  probabilityLevel,
  simulateNextMetrics,
  type LiveMetrics,
  type MapViewKey,
} from '@/lib/service'
import { MapLoader } from './map-loader'
import { DEFAULT_LAYERS, type LayerState } from '@/lib/map-layers'
import { AppSidebar, type NavId } from './app-sidebar'
import { CommandHeader } from './command-header'
import { KpiStrip } from './kpi-strip'
import { SelectedLocationPanel, type MonitorTab } from './selected-location-panel'
import { GlacierSummaryCard, LakeSummaryCard } from './env-summary-cards'
import { MetricsBar, type MetricHistories } from './metrics-bar'
import { MapChrome } from './map-chrome'
import type { LatLng } from '@/lib/service'

const HISTORY_LEN = 26
const DEFAULT_ID = getDefaultLocationId()
const defaultSnapshot = getMetrics(DEFAULT_ID)!

function emptyHistories(): MetricHistories {
  return {
    rainfall: [],
    soilMoisture: [],
    slopeStability: [],
    riverLevel: [],
    floodProbability: [],
  }
}

function historiesFromMetrics(m: LiveMetrics): MetricHistories {
  const flat = (v: number) => Array.from({ length: HISTORY_LEN }, () => v)
  return {
    rainfall: flat(m.rainfall),
    soilMoisture: flat(m.soilMoisture),
    slopeStability: flat(m.slopeStability),
    riverLevel: flat(m.riverLevel),
    floodProbability: flat(m.floodProbability),
  }
}

function seedHistories(start: LiveMetrics): { metrics: LiveMetrics; histories: MetricHistories } {
  let m = { ...start }
  const h: MetricHistories = emptyHistories()
  for (let i = 0; i < HISTORY_LEN; i++) {
    m = simulateNextMetrics(m)
    h.rainfall.push(m.rainfall)
    h.soilMoisture.push(m.soilMoisture)
    h.slopeStability.push(m.slopeStability)
    h.riverLevel.push(m.riverLevel)
    h.floodProbability.push(m.floodProbability)
  }
  return { metrics: m, histories: h }
}

function tabForLocation(id: string | null): MonitorTab {
  const loc = getLocation(id)
  if (loc?.kind === 'glacier') return 'glacier'
  if (loc?.kind === 'lake') return 'lake'
  return 'flood'
}

export function CommandCenter() {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(defaultSnapshot)
  const [histories, setHistories] = useState<MetricHistories>(() =>
    historiesFromMetrics(defaultSnapshot),
  )
  const [now, setNow] = useState<Date | null>(null)
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(DEFAULT_ID)
  const [emptyClick, setEmptyClick] = useState<LatLng | null>(null)
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS)
  const [view, setView] = useState<MapViewKey>('demo')
  const [viewNonce, setViewNonce] = useState(0)
  const [nav, setNav] = useState<NavId>('command')
  const [tab, setTab] = useState<MonitorTab>('flood')

  useEffect(() => {
    const snapshot = getMetrics(selectedLocationId)
    if (!snapshot) {
      setMetrics(null)
      setHistories(emptyHistories())
      return
    }
    const seeded = seedHistories(snapshot)
    setMetrics(seeded.metrics)
    setHistories(seeded.histories)
    const id = setInterval(() => {
      setMetrics((prev) => {
        if (!prev) return prev
        const next = simulateNextMetrics(prev)
        setHistories((h) => ({
          rainfall: [...h.rainfall, next.rainfall].slice(-HISTORY_LEN),
          soilMoisture: [...h.soilMoisture, next.soilMoisture].slice(-HISTORY_LEN),
          slopeStability: [...h.slopeStability, next.slopeStability].slice(-HISTORY_LEN),
          riverLevel: [...h.riverLevel, next.riverLevel].slice(-HISTORY_LEN),
          floodProbability: [...h.floodProbability, next.floodProbability].slice(-HISTORY_LEN),
        }))
        return next
      })
    }, 3000)
    return () => clearInterval(id)
  }, [selectedLocationId])

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const selected = getLocation(selectedLocationId)
  const hasData = Boolean(selected && metrics)
  const threat = metrics ? probabilityLevel(metrics.floodProbability) : null
  const kpis = getCommandKpis(selectedLocationId, metrics)

  function handleSelectLocation(id: string) {
    setEmptyClick(null)
    setSelectedLocationId(id)
    setTab(tabForLocation(id))
  }

  function handleEmptyClick(coord: LatLng) {
    setSelectedLocationId(null)
    setEmptyClick(coord)
  }

  function handleView(next: MapViewKey) {
    setView(next)
    setViewNonce((n) => n + 1)
  }

  function handleNav(id: NavId) {
    setNav(id)
    if (id === 'glacier') {
      setTab('glacier')
      const first = getGlacierForLocation(selectedLocationId) ? selectedLocationId : listGlaciers()[0]?.locationId
      if (first) handleSelectLocation(first)
      handleView('uttarakhand')
    } else if (id === 'lake') {
      setTab('lake')
      const first = getWaterBodyForLocation(selectedLocationId)
        ? selectedLocationId
        : listWaterBodies()[0]?.locationId
      if (first) handleSelectLocation(first)
      handleView('uttarakhand')
    } else if (id === 'flood' || id === 'alerts' || id === 'evac') {
      setTab('flood')
      const floodId =
        selected?.kind === 'flood' ? selectedLocationId : listLocations().find((l) => l.kind === 'flood')?.id
      if (floodId) handleSelectLocation(floodId)
    } else if (id === 'landslide') {
      setTab('landslide')
    } else if (id === 'river') {
      setTab('river')
    } else if (id === 'settlements') {
      setTab('flood')
      handleView('demo')
    } else if (id === 'map') {
      handleView(view)
    }
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-background">
      <div className="hidden md:block">
        <AppSidebar active={nav} onChange={handleNav} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <CommandHeader location={selected} threat={threat} now={now} />
        <KpiStrip kpis={kpis} />

        <div className="flex min-h-0 flex-1">
          <div className="relative min-w-0 flex-1">
            <MapLoader
              layers={layers}
              selectedLocationId={selectedLocationId}
              onSelectLocation={handleSelectLocation}
              onEmptyClick={handleEmptyClick}
              view={view}
              viewNonce={viewNonce}
            />
            <MapChrome layers={layers} setLayers={setLayers} view={view} onView={handleView} />
          </div>

          <aside className="hidden h-full w-[22rem] shrink-0 overflow-y-auto border-l border-panel-border bg-background p-2 lg:block">
            <SelectedLocationPanel
              locationId={selectedLocationId}
              metrics={metrics}
              emptyClick={emptyClick}
              tab={tab}
              onTab={setTab}
            />
          </aside>
        </div>

        <div className="shrink-0 border-t border-panel-border bg-background p-2">
          <div className="flex flex-col gap-2 lg:flex-row">
            <GlacierSummaryCard
              onView={() => {
                handleNav('glacier')
              }}
            />
            <LakeSummaryCard
              onView={() => {
                handleNav('lake')
              }}
            />
            <div className="min-w-0 flex-[1.4] overflow-hidden rounded-md border border-panel-border bg-panel">
              {hasData && metrics ? (
                <MetricsBar metrics={metrics} histories={histories} />
              ) : (
                <div className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                  No telemetry — no monitoring record for this map location.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
