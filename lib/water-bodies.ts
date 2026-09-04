import type { RiskLevel } from './disaster-data'

export type WaterBodyType = 'natural-lake' | 'glacial-lake' | 'reservoir' | 'other-natural'
export type LevelTrend = 'rising' | 'steady' | 'falling'
export type DataStatus = 'simulated'

export interface WaterBodyRecord {
  waterBodyId: string
  name: string
  type: WaterBodyType
  locationId: string
  latitude: number
  longitude: number
  elevation: number
  currentWaterLevel: number
  referenceWaterLevel: number
  levelUnit: 'm'
  levelAnomaly: number
  rateOfRise: number
  rateOfRiseUnit: 'cm/h'
  trend: LevelTrend
  overflowRisk: RiskLevel
  catchmentRainfall: number
  downstreamRisk: RiskLevel
  fillPercent: number
  observationTime: string
  dataStatus: DataStatus
  notes: string
}

export const WATER_BODY_TYPE_LABEL: Record<WaterBodyType, string> = {
  'natural-lake': 'Natural Lake',
  'glacial-lake': 'Glacial Lake',
  reservoir: 'Reservoir',
  'other-natural': 'Other Natural Water Body',
}

export const waterBodies: WaterBodyRecord[] = [
  {
    waterBodyId: 'lk-chorabari-tal',
    name: 'Chorabari Tal',
    type: 'glacial-lake',
    locationId: 'lk-chorabari-tal',
    latitude: 30.745,
    longitude: 79.075,
    elevation: 3840,
    currentWaterLevel: 18.6,
    referenceWaterLevel: 14.2,
    levelUnit: 'm',
    levelAnomaly: 4.4,
    rateOfRise: 6.2,
    rateOfRiseUnit: 'cm/h',
    trend: 'rising',
    overflowRisk: 'critical',
    catchmentRainfall: 28,
    downstreamRisk: 'critical',
    fillPercent: 94,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Prototype GLOF-watch lake. Not a live satellite or CWC gauge.',
  },
  {
    waterBodyId: 'lk-satopanth',
    name: 'Satopanth Lake',
    type: 'glacial-lake',
    locationId: 'lk-satopanth',
    latitude: 30.745,
    longitude: 79.359,
    elevation: 4350,
    currentWaterLevel: 11.4,
    referenceWaterLevel: 9.8,
    levelUnit: 'm',
    levelAnomaly: 1.6,
    rateOfRise: 2.4,
    rateOfRiseUnit: 'cm/h',
    trend: 'rising',
    overflowRisk: 'elevated',
    catchmentRainfall: 15,
    downstreamRisk: 'elevated',
    fillPercent: 81,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Alaknanda headwater glacial lake demonstration series.',
  },
  {
    waterBodyId: 'lk-vasuki',
    name: 'Vasuki Tal',
    type: 'natural-lake',
    locationId: 'lk-vasuki',
    latitude: 30.7,
    longitude: 79.4,
    elevation: 4235,
    currentWaterLevel: 7.1,
    referenceWaterLevel: 6.8,
    levelUnit: 'm',
    levelAnomaly: 0.3,
    rateOfRise: 0.6,
    rateOfRiseUnit: 'cm/h',
    trend: 'steady',
    overflowRisk: 'caution',
    catchmentRainfall: 17,
    downstreamRisk: 'caution',
    fillPercent: 64,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Sparse alpine natural-lake prototype.',
  },
  {
    waterBodyId: 'lk-hemkund',
    name: 'Hemkund',
    type: 'natural-lake',
    locationId: 'lk-hemkund',
    latitude: 30.698,
    longitude: 79.617,
    elevation: 4329,
    currentWaterLevel: 8.4,
    referenceWaterLevel: 8.2,
    levelUnit: 'm',
    levelAnomaly: 0.2,
    rateOfRise: 0.4,
    rateOfRiseUnit: 'cm/h',
    trend: 'steady',
    overflowRisk: 'safe',
    catchmentRainfall: 21,
    downstreamRisk: 'caution',
    fillPercent: 58,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Cirque-lake seasonal band demonstration.',
  },
  {
    waterBodyId: 'lk-tehri',
    name: 'Tehri Reservoir',
    type: 'reservoir',
    locationId: 'lk-tehri',
    latitude: 30.378,
    longitude: 78.48,
    elevation: 830,
    currentWaterLevel: 812.4,
    referenceWaterLevel: 830.0,
    levelUnit: 'm',
    levelAnomaly: -17.6,
    rateOfRise: 1.8,
    rateOfRiseUnit: 'cm/h',
    trend: 'rising',
    overflowRisk: 'caution',
    catchmentRainfall: 32,
    downstreamRisk: 'caution',
    fillPercent: 86,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Reservoir analogue only — not a live dam-safety feed.',
  },
  {
    waterBodyId: 'lk-nainital',
    name: 'Naini Lake',
    type: 'natural-lake',
    locationId: 'lk-nainital',
    latitude: 29.392,
    longitude: 79.454,
    elevation: 1938,
    currentWaterLevel: 12.8,
    referenceWaterLevel: 12.1,
    levelUnit: 'm',
    levelAnomaly: 0.7,
    rateOfRise: 1.1,
    rateOfRiseUnit: 'cm/h',
    trend: 'rising',
    overflowRisk: 'caution',
    catchmentRainfall: 27,
    downstreamRisk: 'caution',
    fillPercent: 74,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'Urban natural-lake prototype for Nainital basin.',
  },
  {
    waterBodyId: 'lk-kedartal',
    name: 'Kedartal',
    type: 'glacial-lake',
    locationId: 'lk-kedartal',
    latitude: 30.9,
    longitude: 78.94,
    elevation: 4725,
    currentWaterLevel: 9.7,
    referenceWaterLevel: 8.1,
    levelUnit: 'm',
    levelAnomaly: 1.6,
    rateOfRise: 3.1,
    rateOfRiseUnit: 'cm/h',
    trend: 'rising',
    overflowRisk: 'elevated',
    catchmentRainfall: 14,
    downstreamRisk: 'elevated',
    fillPercent: 88,
    observationTime: '2026-09-04T18:40:00+05:30',
    dataStatus: 'simulated',
    notes: 'High-elevation glacial lake prototype, limited coverage.',
  },
]
