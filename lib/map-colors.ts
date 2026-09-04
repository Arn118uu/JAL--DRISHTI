import type { RiskLevel } from './disaster-data'

// Concrete color values for Leaflet SVG rendering (presentation attributes
// don't resolve CSS custom properties reliably across browsers).
export const HAZARD_HEX: Record<RiskLevel, string> = {
  safe: '#2dd4a7',
  caution: '#f5c451',
  elevated: '#fb8b3c',
  critical: '#f24d5c',
}

export const MAP_CYAN = '#3fc1e0'
export const RIVER_BLUE = '#38bdf8'

export const ROAD_STATUS_HEX: Record<string, string> = {
  open: '#2dd4a7',
  restricted: '#f5c451',
  cut: '#f24d5c',
}

export const SENSOR_STATUS_HEX: Record<string, string> = {
  online: '#3fc1e0',
  degraded: '#f5c451',
  offline: '#6b7787',
}

// Prediction-coverage footprint colors.
export const COVERAGE_HEX: Record<string, string> = {
  full: '#3fc1e0',
  limited: '#f5c451',
  none: '#6b7787',
}

// Driver-overlay colors (rainfall / soil-moisture heat circles).
export const RAINFALL_BLUE = '#4f83ff'
export const SOIL_BROWN = '#c98b4a'
export const GLACIER_ICE = '#c8e7f5'
export const LAKE_TEAL = '#2eb8c8'
