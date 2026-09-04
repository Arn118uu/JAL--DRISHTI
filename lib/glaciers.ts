import type { LocationKind, LocationRecord } from './locations'
import type { RiskLevel } from './disaster-data'

export type MeltTrend = 'increasing' | 'stable' | 'decreasing'
export type DataStatus = 'simulated'

export interface GlacierRecord {
  glacierId: string
  name: string
  locationId: string
  latitude: number
  longitude: number
  elevation: number
  glacierArea: number
  glacierAreaUnit: 'km²'
  estimatedMeltRate: number
  meltRateUnit: 'm/day'
  meltTrend: MeltTrend
  temperature: number
  snowIceCoverage: number
  historicalBaseline: number
  changeFromBaseline: number
  downstreamRisk: RiskLevel
  observationTime: string
  dataStatus: DataStatus
  notes: string
}

export const glaciers: GlacierRecord[] = [
  {
    glacierId: 'gl-chorabari',
    name: 'Chorabari Glacier',
    locationId: 'gl-chorabari',
    latitude: 30.746,
    longitude: 79.061,
    elevation: 3890,
    glacierArea: 6.4,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 1.32,
    meltRateUnit: 'm/day',
    meltTrend: 'increasing',
    temperature: 4.1,
    snowIceCoverage: 78,
    historicalBaseline: 5.7,
    changeFromBaseline: 12,
    downstreamRisk: 'elevated',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Prototype melt series for Kedarnath headwaters. Not a satellite product.',
  },
  {
    glacierId: 'gl-gangotri',
    name: 'Gangotri Glacier',
    locationId: 'gl-gangotri',
    latitude: 30.932,
    longitude: 79.081,
    elevation: 4120,
    glacierArea: 143,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 0.86,
    meltRateUnit: 'm/day',
    meltTrend: 'increasing',
    temperature: 2.4,
    snowIceCoverage: 84,
    historicalBaseline: 0.71,
    changeFromBaseline: 8,
    downstreamRisk: 'caution',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Demonstration snout-retreat analogue for Bhagirathi source.',
  },
  {
    glacierId: 'gl-satopanth',
    name: 'Satopanth Glacier',
    locationId: 'gl-satopanth',
    latitude: 30.745,
    longitude: 79.4,
    elevation: 4600,
    glacierArea: 21.2,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 1.18,
    meltRateUnit: 'm/day',
    meltTrend: 'increasing',
    temperature: 1.6,
    snowIceCoverage: 81,
    historicalBaseline: 0.94,
    changeFromBaseline: 16,
    downstreamRisk: 'elevated',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Prototype ice-dammed pond growth scenario, Alaknanda headwaters.',
  },
  {
    glacierId: 'gl-khatling',
    name: 'Khatling Glacier',
    locationId: 'gl-khatling',
    latitude: 30.48,
    longitude: 79.12,
    elevation: 3710,
    glacierArea: 12.8,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 0.64,
    meltRateUnit: 'm/day',
    meltTrend: 'stable',
    temperature: 3.2,
    snowIceCoverage: 74,
    historicalBaseline: 0.61,
    changeFromBaseline: 3,
    downstreamRisk: 'caution',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Limited-coverage prototype for Bhilangna catchment.',
  },
  {
    glacierId: 'gl-pindari',
    name: 'Pindari Glacier',
    locationId: 'gl-pindari',
    latitude: 30.275,
    longitude: 80.008,
    elevation: 3660,
    glacierArea: 8.1,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 0.71,
    meltRateUnit: 'm/day',
    meltTrend: 'stable',
    temperature: 3.8,
    snowIceCoverage: 76,
    historicalBaseline: 0.69,
    changeFromBaseline: 2,
    downstreamRisk: 'caution',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Seasonal-envelope demonstration for Pindar basin.',
  },
  {
    glacierId: 'gl-dokriani',
    name: 'Dokriani Glacier',
    locationId: 'gl-dokriani',
    latitude: 30.85,
    longitude: 78.82,
    elevation: 3960,
    glacierArea: 7.0,
    glacierAreaUnit: 'km²',
    estimatedMeltRate: 1.05,
    meltRateUnit: 'm/day',
    meltTrend: 'increasing',
    temperature: 3.0,
    snowIceCoverage: 72,
    historicalBaseline: 0.82,
    changeFromBaseline: 14,
    downstreamRisk: 'elevated',
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'High-melt-risk prototype used to exercise downstream coupling.',
  },
]

export function isGlacierLocation(loc: LocationRecord | null): boolean {
  return loc?.kind === ('glacier' satisfies LocationKind)
}
