'use client'

import { DATA_MODE, type LatLng, type MapViewKey, VIEW_PRESETS } from '@/lib/service'
import { HAZARD_HEX, RIVER_BLUE, ROAD_STATUS_HEX, MAP_CYAN, GLACIER_ICE, LAKE_TEAL } from '@/lib/map-colors'
import { LayerControls } from './left-panel'
import type { LayerState } from '@/lib/map-layers'
import { cn } from '@/lib/utils'

function LegendRow({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex w-5 shrink-0 justify-center">{swatch}</span>
      <span className="font-mono text-[9px] text-muted-foreground">{label}</span>
    </div>
  )
}

export function MapChrome({
  layers,
  setLayers,
  view,
  onView,
}: {
  layers: LayerState
  setLayers: (l: LayerState) => void
  view: MapViewKey
  onView: (key: MapViewKey) => void
}) {
  return (
    <>
      <div className="pointer-events-auto absolute left-2 top-2 z-[500] flex flex-col gap-2">
        <div className="flex gap-1 rounded-md border border-panel-border bg-panel/90 p-1 backdrop-blur-xl">
          {VIEW_PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onView(p.key)}
              className={cn(
                'rounded-sm px-2 py-1 font-mono text-[9px] tracking-[0.12em]',
                view === p.key
                  ? 'bg-primary/15 text-primary ring-1 ring-primary/40'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="w-[16.5rem]">
          <LayerControls layers={layers} setLayers={setLayers} />
        </div>
      </div>
      <div className="pointer-events-auto absolute bottom-2 left-2 z-[500] hidden md:block">
        <div className="w-max rounded-md border border-panel-border bg-panel/90 p-2.5 backdrop-blur-xl">
          <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
            Map legend
          </div>
          <div className="flex flex-col gap-1">
            <LegendRow
              swatch={
                <span
                  className="size-2 rounded-full"
                  style={{ background: HAZARD_HEX.critical }}
                />
              }
              label="Flood / risk site"
            />
            <LegendRow
              swatch={
                <span
                  className="size-2"
                  style={{
                    background: GLACIER_ICE,
                    clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
                  }}
                />
              }
              label="Glacier"
            />
            <LegendRow
              swatch={<span className="size-2 rounded-full" style={{ background: LAKE_TEAL }} />}
              label="Lake / water body"
            />
            <LegendRow
              swatch={<span className="size-2 rotate-45" style={{ background: MAP_CYAN }} />}
              label="Sensor (prototype)"
            />
            <LegendRow
              swatch={<span className="h-1 w-4 rounded-full" style={{ background: RIVER_BLUE }} />}
              label="River reach"
            />
            <LegendRow
              swatch={
                <span
                  className="h-0.5 w-4"
                  style={{
                    backgroundImage: `repeating-linear-gradient(90deg, ${ROAD_STATUS_HEX.cut} 0 3px, transparent 3px 6px)`,
                  }}
                />
              }
              label="Road cut / restricted"
            />
          </div>
          <div className="mt-2 font-mono text-[8px] uppercase tracking-wider text-caution">{DATA_MODE}</div>
        </div>
      </div>
    </>
  )
}

export type EmptyCoord = LatLng

