export interface LayerState {
  riskZones: boolean
  rivers: boolean
  roads: boolean
  villages: boolean
  sensors: boolean
  terrain: boolean
  rainfall: boolean
  soilMoisture: boolean
  coverage: boolean
  glaciers: boolean
  lakes: boolean
}

export const DEFAULT_LAYERS: LayerState = {
  riskZones: true,
  rivers: true,
  roads: true,
  villages: true,
  sensors: true,
  terrain: false,
  rainfall: false,
  soilMoisture: false,
  coverage: false,
  glaciers: true,
  lakes: true,
}
