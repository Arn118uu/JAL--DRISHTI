'use client'

import dynamic from 'next/dynamic'
import type { LayerState } from '@/lib/map-layers'
import type { LatLng, MapViewKey } from '@/lib/service'

const FloodMap = dynamic(() => import('./flood-map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Acquiring terrain grid…
        </span>
      </div>
    </div>
  ),
})

interface MapLoaderProps {
  layers: LayerState
  selectedLocationId: string | null
  onSelectLocation: (id: string) => void
  onEmptyClick: (coord: LatLng) => void
  view: MapViewKey
  viewNonce: number
}

export function MapLoader(props: MapLoaderProps) {
  return <FloodMap {...props} />
}
