'use client'

import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Marker,
  Circle,
  Popup,
  useMap,
  useMapEvents,
  ZoomControl,
} from 'react-leaflet'
import { RISK_META } from '@/lib/disaster-data'
import {
  listCoverageRegions,
  listLocations,
  listRivers,
  listRiskZones,
  listRoads,
  listSensors,
  MAP_VIEWS,
  type LatLng,
  type MapViewKey,
} from '@/lib/service'
import {
  HAZARD_HEX,
  RIVER_BLUE,
  ROAD_STATUS_HEX,
  SENSOR_STATUS_HEX,
  COVERAGE_HEX,
  RAINFALL_BLUE,
  SOIL_BROWN,
  GLACIER_ICE,
  LAKE_TEAL,
} from '@/lib/map-colors'
import { type LayerState } from '@/lib/map-layers'

export type { LayerState }

interface FloodMapProps {
  layers: LayerState
  selectedLocationId: string | null
  onSelectLocation: (id: string) => void
  onEmptyClick: (coord: LatLng) => void
  view: MapViewKey
  viewNonce: number
}

// Fly to a view preset whenever the view key (or its trigger nonce) changes.
function ViewController({ view, nonce }: { view: MapViewKey; nonce: number }) {
  const map = useMap()
  useEffect(() => {
    const v = MAP_VIEWS[view]
    map.flyTo(v.center, v.zoom, { duration: 1.1 })
  }, [view, nonce, map])
  return null
}

// Fly to a selected settlement (keeps user in place if already close).
function FlyToLocation({ id }: { id: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (!id) return
    const loc = listLocations().find((x) => x.id === id)
    if (!loc) return
    const target = map.getZoom() < 9 ? 11 : Math.max(map.getZoom(), 12)
    map.flyTo(loc.coord, target, { duration: 1.0 })
  }, [id, map])
  return null
}

// Map-level click: select the nearest settlement within threshold, otherwise
// signal "no prediction data" for that coordinate.
function MapClickHandler({
  onSelectLocation,
  onEmptyClick,
}: {
  onSelectLocation: (id: string) => void
  onEmptyClick: (coord: LatLng) => void
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      let bestId: string | null = null
      let bestDist = Infinity
      for (const loc of listLocations()) {
        const d = Math.hypot(loc.coord[0] - lat, loc.coord[1] - lng)
        if (d < bestDist) {
          bestDist = d
          bestId = loc.id
        }
      }
      // ~0.02deg ≈ 2km snap radius around a known settlement.
      if (bestId && bestDist <= 0.02) onSelectLocation(bestId)
      else onEmptyClick([lat, lng])
    },
  })
  return null
}

function villageIcon(risk: keyof typeof HAZARD_HEX, name: string, selected: boolean) {
  const color = HAZARD_HEX[risk]
  const pulse =
    risk === 'critical'
      ? `<span style="position:absolute;inset:0;border-radius:9999px;background:${color};opacity:.55;animation:sensor-ping 1.8s cubic-bezier(0,0,.2,1) infinite;"></span>`
      : ''
  const ring = selected
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;border:1.5px solid ${color};box-shadow:0 0 12px ${color};animation:sensor-ping 2s cubic-bezier(0,0,.2,1) infinite;"></span>`
    : ''
  return L.divIcon({
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `
      <div style="position:relative;display:flex;align-items:center;">
        <span style="position:relative;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;">
          ${ring}
          ${pulse}
          <span style="position:relative;width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid rgba(11,18,32,.9);box-shadow:0 0 0 ${
            selected ? '3px' : '1px'
          } ${color}66, 0 0 10px ${color};"></span>
        </span>
        <span style="margin-left:6px;font:600 10px/1.1 var(--font-plex-mono),monospace;letter-spacing:.02em;color:#e6edf5;text-shadow:0 1px 3px rgba(0,0,0,.9);white-space:nowrap;">${name}${
          selected ? ' ◂' : ''
        }</span>
      </div>`,
  })
}

function glacierIcon(name: string, selected: boolean) {
  const color = GLACIER_ICE
  const ring = selected
    ? `<span style="position:absolute;inset:-5px;border:1.5px solid ${color};border-radius:3px;box-shadow:0 0 10px ${color};"></span>`
    : ''
  return L.divIcon({
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `
      <div style="position:relative;display:flex;align-items:center;">
        <span style="position:relative;width:16px;height:16px;">
          ${ring}
          <span style="position:absolute;left:3px;top:2px;width:10px;height:12px;background:${color};clip-path:polygon(50% 0,100% 100%,0 100%);box-shadow:0 0 8px ${color};border:1px solid rgba(11,18,32,.85);"></span>
        </span>
        <span style="margin-left:6px;font:600 10px/1.1 var(--font-plex-mono),monospace;color:#e6edf5;text-shadow:0 1px 3px rgba(0,0,0,.9);white-space:nowrap;">${name}${
          selected ? ' ◂' : ''
        }</span>
      </div>`,
  })
}

function lakeIcon(name: string, selected: boolean) {
  const color = LAKE_TEAL
  const ring = selected
    ? `<span style="position:absolute;inset:-6px;border-radius:9999px;border:1.5px solid ${color};box-shadow:0 0 10px ${color};"></span>`
    : ''
  return L.divIcon({
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    html: `
      <div style="position:relative;display:flex;align-items:center;">
        <span style="position:relative;width:16px;height:16px;">
          ${ring}
          <span style="position:absolute;inset:2px;border-radius:9999px 9999px 4px 4px;background:${color};box-shadow:0 0 8px ${color};border:2px solid rgba(11,18,32,.9);"></span>
        </span>
        <span style="margin-left:6px;font:600 10px/1.1 var(--font-plex-mono),monospace;color:#e6edf5;text-shadow:0 1px 3px rgba(0,0,0,.9);white-space:nowrap;">${name}${
          selected ? ' ◂' : ''
        }</span>
      </div>`,
  })
}
  const color = SENSOR_STATUS_HEX[status]
  const ping =
    status === 'online'
      ? `<span style="position:absolute;inset:0;border-radius:2px;border:1px solid ${color};opacity:.6;animation:sensor-ping 2.4s cubic-bezier(0,0,.2,1) infinite;"></span>`
      : ''
  return L.divIcon({
    className: '',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    html: `
      <div style="position:relative;width:12px;height:12px;">
        ${ping}
        <span style="position:absolute;inset:2px;border-radius:2px;background:${color};box-shadow:0 0 8px ${color}aa;transform:rotate(45deg);"></span>
      </div>`,
  })
}

const sensorTypeLabel: Record<string, string> = {
  'rain-gauge': 'Rain Gauge',
  'river-gauge': 'River Stage Gauge',
  'soil-probe': 'Soil Moisture Probe',
  'slope-incline': 'Slope Inclinometer',
  weather: 'Weather Station',
}

function popupRow(label: string, value: string, color?: string) {
  return `<div style="display:flex;justify-content:space-between;gap:16px;padding:2px 0;">
    <span style="color:#8a97a8;font:500 11px/1.3 var(--font-plex-mono),monospace;text-transform:uppercase;letter-spacing:.05em;">${label}</span>
    <span style="color:${color ?? '#e6edf5'};font:600 12px/1.3 var(--font-plex-mono),monospace;">${value}</span>
  </div>`
}

export default function FloodMap({
  layers,
  selectedLocationId,
  onSelectLocation,
  onEmptyClick,
  view,
  viewNonce,
}: FloodMapProps) {
  const locations = listLocations()
  const allSensors = listSensors()
  const coverageRegions = listCoverageRegions()
  const riskZones = listRiskZones()
  const rivers = listRivers()
  const roads = listRoads()

  const floodSites = locations.filter((v) => v.kind === 'flood')
  const glacierSites = locations.filter((v) => v.kind === 'glacier')
  const lakeSites = locations.filter((v) => v.kind === 'lake')

  const villageIcons = useMemo(
    () =>
      Object.fromEntries(
        floodSites.map((v) => [v.id, villageIcon(v.risk, v.name, v.id === selectedLocationId)]),
      ),
    [floodSites, selectedLocationId],
  )

  const glacierIcons = useMemo(
    () =>
      Object.fromEntries(
        glacierSites.map((v) => [v.id, glacierIcon(v.name, v.id === selectedLocationId)]),
      ),
    [glacierSites, selectedLocationId],
  )

  const lakeIcons = useMemo(
    () =>
      Object.fromEntries(lakeSites.map((v) => [v.id, lakeIcon(v.name, v.id === selectedLocationId)])),
    [lakeSites, selectedLocationId],
  )

  const sensorIcons = useMemo(
    () => Object.fromEntries(allSensors.map((s) => [s.id, sensorIcon(s.status)])),
    [allSensors],
  )

  return (
    <MapContainer
      center={MAP_VIEWS.demo.center as LatLng}
      zoom={MAP_VIEWS.demo.zoom}
      minZoom={2}
      maxZoom={17}
      zoomControl={false}
      worldCopyJump
      className="h-full w-full"
      preferCanvas={false}
    >
      <ZoomControl position="topright" />
      <TileLayer
        url="https://{s}.basemap.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO · JAL-DRISHTI NDRF/USDMA'
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Elevation / terrain hillshade overlay */}
      {layers.terrain && (
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
          attribution="Esri World Hillshade"
          opacity={0.4}
          maxZoom={17}
        />
      )}

      {/* Prediction-coverage footprints */}
      {layers.coverage &&
        coverageRegions.map((c) => (
          <Polygon
            key={c.id}
            positions={c.polygon}
            pathOptions={{
              color: COVERAGE_HEX[c.coverage],
              weight: 1,
              dashArray: c.coverage === 'limited' ? '6 6' : '2 5',
              fillColor: COVERAGE_HEX[c.coverage],
              fillOpacity: c.coverage === 'full' ? 0.08 : 0.04,
            }}
          >
            <Popup>
              <div style={{ padding: '10px 12px', minWidth: 200 }}>
                <div
                  style={{
                    font: '700 12px/1.3 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 6,
                  }}
                >
                  {c.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: popupRow(
                      'Coverage',
                      c.coverage.toUpperCase(),
                      COVERAGE_HEX[c.coverage],
                    ),
                  }}
                />
              </div>
            </Popup>
          </Polygon>
        ))}

      {/* Rainfall intensity overlay */}
      {layers.rainfall &&
        locations.map((v) => (
          <Circle
            key={`rain-${v.id}`}
            center={v.coord}
            radius={600 + v.rainfall * 40}
            pathOptions={{
              stroke: false,
              fillColor: RAINFALL_BLUE,
              fillOpacity: 0.1 + Math.min(0.35, v.rainfall / 200),
            }}
          />
        ))}

      {/* Soil-moisture overlay */}
      {layers.soilMoisture &&
        locations.map((v) => (
          <Circle
            key={`soil-${v.id}`}
            center={v.coord}
            radius={400 + v.soilMoisture * 22}
            pathOptions={{
              stroke: false,
              fillColor: SOIL_BROWN,
              fillOpacity: 0.08 + Math.min(0.3, v.soilMoisture / 320),
            }}
          />
        ))}

      {layers.riskZones &&
        riskZones.map((z) => (
          <Polygon
            key={z.id}
            positions={z.polygon}
            pathOptions={{
              color: HAZARD_HEX[z.level],
              weight: 1.5,
              fillColor: HAZARD_HEX[z.level],
              fillOpacity: 0.22,
              dashArray: z.level === 'critical' ? undefined : '4 4',
            }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 220 }}>
                <div
                  style={{
                    font: '700 13px/1.2 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {z.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow(
                        'Risk',
                        RISK_META[z.level].label,
                        HAZARD_HEX[z.level],
                      ) +
                      popupRow('Area', `${z.areaKm2} km²`) +
                      `<div style="margin-top:8px;color:#a9b4c2;font:400 11px/1.5 var(--font-plex-sans),sans-serif;">${z.note}</div>`,
                  }}
                />
              </div>
            </Popup>
          </Polygon>
        ))}

      {layers.rivers &&
        rivers.map((r) => (
          <Polyline
            key={r.id}
            positions={r.path}
            pathOptions={{
              color: RIVER_BLUE,
              weight: r.level === 'critical' ? 6 : 4,
              opacity: 0.85,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 200 }}>
                <div
                  style={{
                    font: '700 13px/1.2 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {r.name} River
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow('Stage', `${r.stageM.toFixed(1)} m`, RIVER_BLUE) +
                      popupRow('Danger mark', `${r.dangerM.toFixed(1)} m`) +
                      popupRow(
                        'Status',
                        RISK_META[r.level].label,
                        HAZARD_HEX[r.level],
                      ),
                  }}
                />
              </div>
            </Popup>
          </Polyline>
        ))}

      {layers.roads &&
        roads.map((rd) => (
          <Polyline
            key={rd.id}
            positions={rd.path}
            pathOptions={{
              color: ROAD_STATUS_HEX[rd.status],
              weight: 2.5,
              opacity: 0.9,
              dashArray: rd.status === 'cut' ? '2 7' : rd.status === 'restricted' ? '10 6' : undefined,
              lineCap: 'round',
            }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 200 }}>
                <div
                  style={{
                    font: '700 12px/1.3 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {rd.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: popupRow(
                      'Access',
                      rd.status.toUpperCase(),
                      ROAD_STATUS_HEX[rd.status],
                    ),
                  }}
                />
              </div>
            </Popup>
          </Polyline>
        ))}

      {layers.sensors &&
        allSensors.map((s) => (
          <Marker key={s.id} position={s.coord} icon={sensorIcons[s.id]}>
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 210 }}>
                <div
                  style={{
                    font: '700 12px/1.3 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {s.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow('Type', sensorTypeLabel[s.type]) +
                      popupRow(
                        'Reading',
                        s.status === 'offline' ? '— no data' : `${s.primaryValue} ${s.unit}`,
                        SENSOR_STATUS_HEX[s.status],
                      ) +
                      popupRow('Status', s.status.toUpperCase(), SENSOR_STATUS_HEX[s.status]),
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.villages &&
        floodSites.map((v) => (
          <Marker
            key={v.id}
            position={v.coord}
            icon={villageIcons[v.id]}
            eventHandlers={{ click: () => onSelectLocation(v.id) }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 230 }}>
                <div
                  style={{
                    font: '700 13px/1.2 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {v.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow('Type', 'Flood / settlement') +
                      popupRow('Region', `${v.district}, ${v.state}`) +
                      popupRow('Risk', RISK_META[v.risk].label, HAZARD_HEX[v.risk]) +
                      popupRow('Flood prob.', `${v.floodProbability}%`, HAZARD_HEX[v.risk]) +
                      popupRow('Lead time', `${v.leadTimeMin} min`) +
                      popupRow('Coverage', v.coverage.toUpperCase(), COVERAGE_HEX[v.coverage]),
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.glaciers &&
        glacierSites.map((v) => (
          <Marker
            key={v.id}
            position={v.coord}
            icon={glacierIcons[v.id]}
            eventHandlers={{ click: () => onSelectLocation(v.id) }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 220 }}>
                <div
                  style={{
                    font: '700 13px/1.2 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {v.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow('Type', 'Glacier') +
                      popupRow('Region', `${v.district}, ${v.state}`) +
                      popupRow('Elevation', `${v.elevationM} m`) +
                      popupRow('Data', 'SIMULATED / PROTOTYPE', '#f5c451'),
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}

      {layers.lakes &&
        lakeSites.map((v) => (
          <Marker
            key={v.id}
            position={v.coord}
            icon={lakeIcons[v.id]}
            eventHandlers={{ click: () => onSelectLocation(v.id) }}
          >
            <Popup>
              <div style={{ padding: '12px 14px', minWidth: 220 }}>
                <div
                  style={{
                    font: '700 13px/1.2 var(--font-plex-sans),sans-serif',
                    color: '#e6edf5',
                    marginBottom: 8,
                  }}
                >
                  {v.name}
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      popupRow('Type', 'Lake / water body') +
                      popupRow('Region', `${v.district}, ${v.state}`) +
                      popupRow('Elevation', `${v.elevationM} m`) +
                      popupRow('Data', 'SIMULATED / PROTOTYPE', '#f5c451'),
                  }}
                />
              </div>
            </Popup>
          </Marker>
        ))}

      <MapClickHandler
        onSelectLocation={onSelectLocation}
        onEmptyClick={onEmptyClick}
      />
      <ViewController view={view} nonce={viewNonce} />
      <FlyToLocation id={selectedLocationId} />
    </MapContainer>
  )
}
