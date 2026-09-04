// Thin data accessors for JAL-DRISHTI.
// UI components should import from this module rather than raw demo tables.
// A future FastAPI client can replace these function bodies without rewriting HUD/map code.
//
// All numeric values returned here are SIMULATED / PROTOTYPE unless a live
// adapter is explicitly wired in.

import {
  nextMetrics,
  probabilityLevel,
  riskZones,
  rivers,
  roads,
  sensors,
  type Alert,
  type EvacStep,
  type FeatureContribution,
  type LatLng,
  type LiveMetrics,
  type RiskLevel,
  type RiskZone,
  type RiverReach,
  type RoadSegment,
  type Sensor,
} from './disaster-data'
import {
  coverageRegions,
  DEFAULT_LOCATION_ID,
  getLocation as lookupLocation,
  locationList,
  MAP_VIEWS,
  metricsForLocation,
  VIEW_PRESETS,
  type CoverageRegion,
  type LocationKind,
  type LocationRecord,
  type MapViewKey,
} from './locations'
import { glaciers, type GlacierRecord } from './glaciers'
import {
  waterBodies,
  WATER_BODY_TYPE_LABEL,
  type WaterBodyRecord,
} from './water-bodies'

export type {
  Alert,
  CoverageRegion,
  EvacStep,
  FeatureContribution,
  GlacierRecord,
  LatLng,
  LiveMetrics,
  LocationKind,
  LocationRecord,
  MapViewKey,
  RiskLevel,
  RiskZone,
  RiverReach,
  RoadSegment,
  Sensor,
  WaterBodyRecord,
}

export { MAP_VIEWS, VIEW_PRESETS, probabilityLevel, WATER_BODY_TYPE_LABEL }

export const DATA_MODE = 'SIMULATED / PROTOTYPE' as const

export function getDefaultLocationId(): string {
  return DEFAULT_LOCATION_ID
}

export function getLocation(locationId: string | null | undefined): LocationRecord | null {
  if (!locationId) return null
  return lookupLocation(locationId)
}

export function listLocations(): LocationRecord[] {
  return locationList
}

export function listCoverageRegions(): CoverageRegion[] {
  return coverageRegions
}

export function listRiskZones(): RiskZone[] {
  return riskZones
}

export function listRivers(): RiverReach[] {
  return rivers
}

export function listRoads(): RoadSegment[] {
  return roads
}

/** All prototype sensors, or those named on a location record. Unknown locations → []. */
export function listSensors(locationId?: string | null): Sensor[] {
  if (locationId === undefined) return sensors
  const loc = getLocation(locationId)
  if (!loc) return []
  return sensors.filter((s) => loc.nearbySensors.includes(s.name))
}

/**
 * Telemetry snapshot for a location that has a monitoring record.
 * Returns null when the id is missing or unknown — never invents values.
 */
export function getMetrics(locationId: string | null | undefined): LiveMetrics | null {
  const loc = getLocation(locationId)
  if (!loc) return null
  return metricsForLocation(loc)
}

export function simulateNextMetrics(prev: LiveMetrics): LiveMetrics {
  return nextMetrics(prev)
}

export function listAlerts(locationId: string | null | undefined): Alert[] {
  const loc = getLocation(locationId)
  if (!loc) return []
  return [
    {
      id: `${loc.id}-alert`,
      severity: loc.risk,
      title: loc.alertStatus,
      location: `${loc.name}, ${loc.district}, ${loc.state}`,
      issuedMinAgo: loc.risk === 'critical' ? 6 : loc.risk === 'elevated' ? 14 : 28,
      message: loc.recommendedAction,
    },
  ]
}

export function getFeatureContributions(
  locationId: string | null | undefined,
  metrics?: LiveMetrics | null,
): FeatureContribution[] {
  const loc = getLocation(locationId)
  if (!loc) return []
  const rainfall = metrics?.rainfall ?? loc.rainfall
  const soil = metrics?.soilMoisture ?? loc.soilMoisture
  const river = metrics?.riverLevel ?? loc.riverLevel
  const slopeStress = 100 - (metrics?.slopeStability ?? loc.slopeStability)
  const floodP = metrics?.floodProbability ?? loc.floodProbability

  const raw = [
    { feature: 'Rainfall intensity', value: `${rainfall.toFixed(0)} mm/h`, w: Math.max(1, rainfall) },
    { feature: 'Soil saturation', value: `${soil.toFixed(0)} %VWC`, w: Math.max(1, soil * 0.7) },
    {
      feature: 'River stage vs danger',
      value: `${river.toFixed(1)} / ${loc.riverDanger.toFixed(1)} m`,
      w: Math.max(1, (river / loc.riverDanger) * 80),
    },
    { feature: 'Slope stress', value: `${slopeStress.toFixed(0)} /100`, w: Math.max(1, slopeStress) },
    { feature: 'Model flood probability', value: `${floodP.toFixed(0)}%`, w: Math.max(1, floodP * 0.35) },
  ]
  const total = raw.reduce((s, r) => s + r.w, 0)
  return raw.map((r) => ({
    feature: r.feature,
    value: r.value,
    contribution: Math.max(1, Math.round((r.w / total) * 100)),
    direction: 'increasing' as const,
  }))
}

export function listGlaciers(): GlacierRecord[] {
  return glaciers
}

export function getGlacier(glacierId: string | null | undefined): GlacierRecord | null {
  if (!glacierId) return null
  return glaciers.find((g) => g.glacierId === glacierId) ?? null
}

export function getGlacierForLocation(locationId: string | null | undefined): GlacierRecord | null {
  if (!locationId) return null
  return glaciers.find((g) => g.locationId === locationId || g.glacierId === locationId) ?? null
}

export function listWaterBodies(): WaterBodyRecord[] {
  return waterBodies
}

export function getWaterBody(waterBodyId: string | null | undefined): WaterBodyRecord | null {
  if (!waterBodyId) return null
  return waterBodies.find((w) => w.waterBodyId === waterBodyId) ?? null
}

export function getWaterBodyForLocation(locationId: string | null | undefined): WaterBodyRecord | null {
  if (!locationId) return null
  return (
    waterBodies.find((w) => w.locationId === locationId || w.waterBodyId === locationId) ?? null
  )
}

export function getGlacierSummary() {
  const all = listGlaciers()
  const high = all.filter((g) => g.downstreamRisk === 'elevated' || g.downstreamRisk === 'critical')
  const avgMelt =
    all.length === 0 ? 0 : all.reduce((s, g) => s + g.estimatedMeltRate, 0) / all.length
  return {
    monitored: all.length,
    highMeltRisk: high.length,
    avgMeltRate: avgMelt,
  }
}

export function getWaterBodySummary() {
  const all = listWaterBodies()
  const high = all.filter((w) => w.overflowRisk === 'elevated' || w.overflowRisk === 'critical')
  const avgFill = all.length === 0 ? 0 : all.reduce((s, w) => s + w.fillPercent, 0) / all.length
  return {
    monitored: all.length,
    highLevel: high.length,
    avgFillPercent: avgFill,
  }
}

export function getCommandKpis(selectedId: string | null, metrics: LiveMetrics | null) {
  const floodSites = listLocations().filter((l) => l.kind === 'flood')
  const highRisk = floodSites.filter((l) => l.risk === 'elevated' || l.risk === 'critical')
  const peopleAtRisk = highRisk.reduce((s, l) => s + l.population, 0)
  const avgFlood =
    floodSites.length === 0
      ? 0
      : floodSites.reduce((s, l) => s + l.floodProbability, 0) / floodSites.length
  const alerts = floodSites.filter((l) => l.risk !== 'safe').length
  const allSensors = listSensors()
  const criticalSensors = allSensors.filter((s) => s.status !== 'online').length
  const glaciersSummary = getGlacierSummary()
  const lakesSummary = getWaterBodySummary()
  return {
    activeAlerts: alerts,
    highRiskSettlements: highRisk.length,
    peopleAtRisk,
    avgFloodProbability: avgFlood,
    criticalSensors,
    leadTimeMin: metrics?.leadTimeMin ?? null,
    rainfall: metrics?.rainfall ?? null,
    riverLevel: metrics?.riverLevel ?? null,
    glaciersMonitored: glaciersSummary.monitored,
    highRiskGlaciers: glaciersSummary.highMeltRisk,
    lakesMonitored: lakesSummary.monitored,
    highLevelWaterBodies: lakesSummary.highLevel,
    selectedId,
  }
}

export type CommandKpis = ReturnType<typeof getCommandKpis>

export function getEvacuationPlan(locationId: string | null | undefined): EvacStep[] {
  const loc = getLocation(locationId)
  if (!loc) return []
  const order =
    loc.risk === 'critical' ? 'P1' : loc.risk === 'elevated' ? 'P2' : loc.risk === 'caution' ? 'P3' : 'P4'
  const action =
    loc.risk === 'critical'
      ? 'Immediate protective action'
      : loc.risk === 'elevated'
        ? 'Stage response assets'
        : loc.risk === 'caution'
          ? 'Pre-alert & shelter prep'
          : 'Standby — no evacuation'
  return [
    {
      order,
      action,
      target: `${loc.name} · ${loc.nearbyRiver}`,
      tone: loc.risk,
      detail: loc.recommendedAction,
    },
  ]
}
