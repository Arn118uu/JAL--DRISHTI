'use client'

import {
  Layers,
  Waves,
  Route,
  MapPin,
  Radio,
  Mountain,
  CloudRain,
  Droplets,
  Scan,
  Snowflake,
} from 'lucide-react'
import { Panel, PanelHeader } from './hud'
import type { LayerState } from '@/lib/map-layers'
import { cn } from '@/lib/utils'

const LAYER_DEFS: { key: keyof LayerState; label: string; icon: React.ReactNode }[] = [
  { key: 'riskZones', label: 'Risk Zones', icon: <Layers /> },
  { key: 'rivers', label: 'Rivers', icon: <Waves /> },
  { key: 'roads', label: 'Roads', icon: <Route /> },
  { key: 'villages', label: 'Flood sites', icon: <MapPin /> },
  { key: 'glaciers', label: 'Glaciers', icon: <Snowflake /> },
  { key: 'lakes', label: 'Lakes', icon: <Waves /> },
  { key: 'sensors', label: 'Sensors', icon: <Radio /> },
  { key: 'terrain', label: 'Terrain', icon: <Mountain /> },
  { key: 'rainfall', label: 'Rainfall', icon: <CloudRain /> },
  { key: 'soilMoisture', label: 'Soil Moisture', icon: <Droplets /> },
  { key: 'coverage', label: 'Pred. Coverage', icon: <Scan /> },
]

export function LayerControls({
  layers,
  setLayers,
}: {
  layers: LayerState
  setLayers: (l: LayerState) => void
}) {
  return (
    <Panel>
      <PanelHeader title="Map Layers" icon={<Layers />} />
      <div className="grid grid-cols-2 gap-1 p-2">
        {LAYER_DEFS.map((l) => {
          const active = layers[l.key]
          return (
            <button
              key={l.key}
              type="button"
              onClick={() => setLayers({ ...layers, [l.key]: !active })}
              aria-pressed={active}
              className={cn(
                'flex items-center gap-1.5 rounded-sm border px-1.5 py-1 font-mono text-[10px] transition-colors',
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-panel-border bg-muted/40 text-muted-foreground hover:text-foreground',
              )}
            >
              <span className="[&>svg]:size-3">{l.icon}</span>
              <span className="truncate">{l.label}</span>
            </button>
          )
        })}
      </div>
    </Panel>
  )
}
