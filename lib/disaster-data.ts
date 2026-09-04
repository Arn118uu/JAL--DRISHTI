// Geospatial + telemetry data model for the JAL-DRISHTI flash-flood command center.
// Anchored to the Mandakini–Alaknanda valley around Rudraprayag, Uttarakhand.

export type RiskLevel = 'safe' | 'caution' | 'elevated' | 'critical'
export type LatLng = [number, number]

export function probabilityLevel(p: number): RiskLevel {
  if (p >= 80) return 'critical'
  if (p >= 60) return 'elevated'
  if (p >= 40) return 'caution'
  return 'safe'
}

export const RISK_META: Record<
  RiskLevel,
  { label: string; token: string; order: number }
> = {
  safe: { label: 'Nominal', token: 'var(--color-safe)', order: 0 },
  caution: { label: 'Watch', token: 'var(--color-caution)', order: 1 },
  elevated: { label: 'Warning', token: 'var(--color-elevated)', order: 2 },
  critical: { label: 'Critical', token: 'var(--color-critical)', order: 3 },
}

export const REGION = {
  name: 'Mandakini–Alaknanda Basin',
  district: 'Rudraprayag',
  state: 'Uttarakhand',
  center: [30.288, 78.98] as LatLng,
  zoom: 12,
}

export interface RiskZone {
  id: string
  name: string
  level: RiskLevel
  polygon: LatLng[]
  areaKm2: number
  note: string
}

export interface Sensor {
  id: string
  name: string
  coord: LatLng
  type: 'rain-gauge' | 'river-gauge' | 'soil-probe' | 'slope-incline' | 'weather'
  status: 'online' | 'degraded' | 'offline'
  primaryValue: number
  unit: string
  trend: 'up' | 'down' | 'flat'
}

export interface RiverReach {
  id: string
  name: string
  path: LatLng[]
  level: RiskLevel
  stageM: number
  dangerM: number
}

export interface RoadSegment {
  id: string
  name: string
  path: LatLng[]
  status: 'open' | 'restricted' | 'cut'
}

export interface Alert {
  id: string
  severity: RiskLevel
  title: string
  location: string
  issuedMinAgo: number
  message: string
}

export interface FeatureContribution {
  feature: string
  contribution: number // percent share of the prediction
  direction: 'increasing' | 'decreasing'
  value: string
}

export interface EvacStep {
  order: string
  action: string
  target: string
  tone: RiskLevel
  detail: string
}

export const riskZones: RiskZone[] = [
  {
    id: 'rz-1',
    name: 'Mandakini Confluence Floodplain',
    level: 'critical',
    areaKm2: 4.2,
    note: 'Rapid stage rise + debris load; historical 2013 impact corridor.',
    polygon: [
      [30.302, 78.966],
      [30.298, 78.985],
      [30.285, 78.99],
      [30.276, 78.978],
      [30.288, 78.962],
    ],
  },
  {
    id: 'rz-2',
    name: 'Kaliasaur Slope Failure Belt',
    level: 'elevated',
    areaKm2: 2.7,
    note: 'Saturated colluvium above NH-107; landslide-dam breach risk.',
    polygon: [
      [30.316, 78.995],
      [30.31, 79.012],
      [30.298, 79.014],
      [30.3, 78.996],
    ],
  },
  {
    id: 'rz-3',
    name: 'Alaknanda Left-Bank Terrace',
    level: 'caution',
    areaKm2: 3.4,
    note: 'Moderate saturation; monitor overnight rainfall accumulation.',
    polygon: [
      [30.272, 78.985],
      [30.264, 79.002],
      [30.25, 78.998],
      [30.256, 78.98],
    ],
  },
  {
    id: 'rz-4',
    name: 'Upper Ridge Catchment',
    level: 'safe',
    areaKm2: 6.1,
    note: 'Well-drained ridge; low convergence, stable readings.',
    polygon: [
      [30.33, 78.95],
      [30.335, 78.968],
      [30.322, 78.972],
      [30.318, 78.952],
    ],
  },
]

export const sensors: Sensor[] = [
  {
    id: 's-1',
    name: 'RG-01 Confluence',
    coord: [30.293, 78.976],
    type: 'river-gauge',
    status: 'online',
    primaryValue: 4.8,
    unit: 'm',
    trend: 'up',
  },
  {
    id: 's-2',
    name: 'RN-04 Silli Ridge',
    coord: [30.301, 78.968],
    type: 'rain-gauge',
    status: 'online',
    primaryValue: 62,
    unit: 'mm/h',
    trend: 'up',
  },
  {
    id: 's-3',
    name: 'SP-02 Kaliasaur',
    coord: [30.309, 79.0],
    type: 'soil-probe',
    status: 'online',
    primaryValue: 91,
    unit: '%VWC',
    trend: 'up',
  },
  {
    id: 's-4',
    name: 'IN-03 Slope Array',
    coord: [30.312, 79.008],
    type: 'slope-incline',
    status: 'degraded',
    primaryValue: 2.4,
    unit: '°/hr',
    trend: 'up',
  },
  {
    id: 's-5',
    name: 'RG-02 Alaknanda',
    coord: [30.27, 78.996],
    type: 'river-gauge',
    status: 'online',
    primaryValue: 3.1,
    unit: 'm',
    trend: 'flat',
  },
  {
    id: 's-6',
    name: 'WX-01 Ridge Station',
    coord: [30.33, 78.964],
    type: 'weather',
    status: 'online',
    primaryValue: 44,
    unit: 'mm/h',
    trend: 'down',
  },
  {
    id: 's-7',
    name: 'SP-05 Jawari',
    coord: [30.266, 78.99],
    type: 'soil-probe',
    status: 'offline',
    primaryValue: 0,
    unit: '%VWC',
    trend: 'flat',
  },
]

export const rivers: RiverReach[] = [
  {
    id: 'r-1',
    name: 'Alaknanda',
    level: 'critical',
    stageM: 4.8,
    dangerM: 5.2,
    path: [
      [30.34, 78.94],
      [30.322, 78.955],
      [30.305, 78.972],
      [30.29, 78.98],
      [30.272, 78.99],
      [30.255, 79.006],
      [30.238, 79.02],
    ],
  },
  {
    id: 'r-2',
    name: 'Mandakini',
    level: 'critical',
    stageM: 4.3,
    dangerM: 4.6,
    path: [
      [30.33, 79.02],
      [30.315, 79.0],
      [30.302, 78.988],
      [30.29, 78.98],
    ],
  },
]

export const roads: RoadSegment[] = [
  {
    id: 'road-1',
    name: 'NH-107 (Rudraprayag–Kedarnath)',
    status: 'restricted',
    path: [
      [30.286, 78.981],
      [30.3, 78.99],
      [30.31, 79.005],
      [30.322, 79.02],
    ],
  },
  {
    id: 'road-2',
    name: 'NH-7 (Rishikesh–Badrinath)',
    status: 'cut',
    path: [
      [30.25, 79.01],
      [30.268, 78.994],
      [30.286, 78.981],
      [30.305, 78.968],
      [30.325, 78.95],
    ],
  },
  {
    id: 'road-3',
    name: 'Evacuation Route E-1 (Ridge Shelter)',
    status: 'open',
    path: [
      [30.2865, 78.9805],
      [30.3, 78.972],
      [30.315, 78.965],
      [30.328, 78.962],
    ],
  },
]

// ---- Simulated telemetry helpers (prototype only; not live feeds) ---------

export interface LiveMetrics {
  rainfall: number // mm/h
  soilMoisture: number // %VWC
  slopeStability: number // 0-100 (higher = more stable)
  riverLevel: number // m
  riverDanger: number // m
  floodProbability: number // 0-100
  leadTimeMin: number
  confidence: number // 0-100
  updatedAt: number
}

export const baseMetrics: LiveMetrics = {
  rainfall: 62,
  soilMoisture: 91,
  slopeStability: 34,
  riverLevel: 4.8,
  riverDanger: 5.2,
  floodProbability: 87,
  leadTimeMin: 42,
  confidence: 93,
  updatedAt: Date.now(),
}

function drift(value: number, amount: number, min: number, max: number) {
  const next = value + (Math.random() - 0.5) * amount
  return Math.min(max, Math.max(min, next))
}

export function nextMetrics(prev: LiveMetrics): LiveMetrics {
  const rainfall = drift(prev.rainfall, 6, 20, 80)
  const soilMoisture = drift(prev.soilMoisture, 2, 60, 99)
  const slopeStability = drift(prev.slopeStability, 3, 20, 70)
  const riverLevel = drift(prev.riverLevel, 0.12, 3.6, 5.5)
  // Flood probability tracks the drivers, staying in a tense high band.
  const driverPush =
    (rainfall - 50) * 0.3 + (soilMoisture - 80) * 0.6 + (riverLevel - 4.5) * 12
  const floodProbability = Math.min(
    98,
    Math.max(55, prev.floodProbability + driverPush * 0.05 + (Math.random() - 0.5) * 2),
  )
  const leadTimeMin = Math.round(
    Math.min(120, Math.max(18, 42 - (floodProbability - 87) * 0.8 + (Math.random() - 0.5) * 4)),
  )
  const confidence = drift(prev.confidence, 2, 84, 97)
  return {
    ...prev,
    rainfall,
    soilMoisture,
    slopeStability,
    riverLevel,
    floodProbability,
    leadTimeMin,
    confidence,
    updatedAt: Date.now(),
  }
}
