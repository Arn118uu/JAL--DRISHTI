'use client'

import {
  DATA_MODE,
  WATER_BODY_TYPE_LABEL,
  getEvacuationPlan,
  getFeatureContributions,
  getGlacierForLocation,
  getLocation,
  getWaterBodyForLocation,
  listAlerts,
  listSensors,
  probabilityLevel,
  type LatLng,
  type LiveMetrics,
  type LocationKind,
} from '@/lib/service'
import { Panel, PanelHeader, HazardBadge, RingGauge, StatusDot } from './hud'
import { cn } from '@/lib/utils'

export type MonitorTab = 'flood' | 'glacier' | 'lake' | 'landslide' | 'river'

const TABS: { id: MonitorTab; label: string; ready: boolean }[] = [
  { id: 'flood', label: 'FLOOD', ready: true },
  { id: 'glacier', label: 'GLACIER', ready: true },
  { id: 'lake', label: 'LAKE', ready: true },
  { id: 'landslide', label: 'LANDSLIDE', ready: false },
  { id: 'river', label: 'RIVER', ready: false },
]

function Field({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="border-b border-panel-border/70 py-1.5 last:border-0">
      <div className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className={cn('mt-0.5 font-mono text-[12px] font-semibold tabular-nums text-foreground', tone)}>
        {value}
      </div>
    </div>
  )
}

function NoPredictionData({ coord }: { coord: LatLng | null }) {
  return (
    <Panel className="p-3">
      <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        Data availability
      </div>
      <h2 className="mt-2 font-sans text-sm font-semibold text-foreground">
        No prediction data available for this location.
      </h2>
      <p className="mt-2 font-sans text-[12px] leading-relaxed text-muted-foreground">
        Geographic map coverage is not the same as a monitored site. JAL-DRISHTI only shows
        telemetry for locations that have a monitoring record.
      </p>
      {coord ? (
        <p className="mt-3 font-mono text-[11px] tabular-nums text-muted-foreground">
          {coord[0].toFixed(4)}°N {coord[1].toFixed(4)}°E
        </p>
      ) : null}
      <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-caution">
        Data mode · {DATA_MODE}
      </p>
    </Panel>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <p className="p-3 font-sans text-[12px] leading-relaxed text-muted-foreground">
      {title} is reserved in the monitoring architecture and is not implemented in this prototype.
    </p>
  )
}

export function SelectedLocationPanel({
  locationId,
  metrics,
  emptyClick,
  tab,
  onTab,
}: {
  locationId: string | null
  metrics: LiveMetrics | null
  emptyClick: LatLng | null
  tab: MonitorTab
  onTab: (t: MonitorTab) => void
}) {
  const loc = getLocation(locationId)
  const glacier = getGlacierForLocation(locationId)
  const lake = getWaterBodyForLocation(locationId)
  const alerts = listAlerts(locationId)
  const sensors = listSensors(locationId)
  const contributions = getFeatureContributions(locationId, metrics)
  const evac = getEvacuationPlan(locationId)

  if (!loc) {
    return (
      <div className="flex h-full flex-col gap-2 overflow-y-auto">
        <div className="px-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Selected location
        </div>
        <NoPredictionData coord={emptyClick} />
      </div>
    )
  }

  const kind: LocationKind = loc.kind
  const level = metrics ? probabilityLevel(metrics.floodProbability) : loc.risk
  const color = `var(--color-${level})`

  return (
    <div className="flex h-full flex-col gap-2 overflow-y-auto pr-0.5">
      <Panel>
        <PanelHeader
          title="Selected location"
          right={
            <span className="font-mono text-[9px] uppercase text-caution">{DATA_MODE}</span>
          }
        />
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-sans text-sm font-semibold text-foreground">{loc.name}</div>
              <div className="mt-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                {loc.district}, {loc.state} · {kind}
              </div>
            </div>
            <HazardBadge level={loc.risk} pulse={loc.risk === 'critical'} />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-x-3">
            <Field label="Elevation" value={`${loc.elevationM} m`} />
            <Field label="Coverage" value={loc.coverage.toUpperCase()} />
            <Field
              label="Grid"
              value={`${loc.coord[0].toFixed(3)}°N ${loc.coord[1].toFixed(3)}°E`}
            />
            <Field label="Nearby channel" value={loc.nearbyRiver} />
          </div>
        </div>
        <div className="flex border-t border-panel-border">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTab(t.id)}
              className={cn(
                'flex-1 px-1 py-1.5 font-mono text-[8px] tracking-wider',
                tab === t.id
                  ? 'bg-primary/12 text-primary'
                  : 'text-muted-foreground hover:text-foreground',
                !t.ready && 'opacity-70',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Panel>

      {tab === 'flood' && metrics && (
        <>
          <Panel>
            <PanelHeader title="Flood probability" right={<span className="font-mono text-[9px] text-muted-foreground">prototype</span>} />
            <div className="flex items-center gap-3 p-3">
              <RingGauge
                value={metrics.floodProbability}
                color={color}
                label={`${metrics.floodProbability.toFixed(0)}%`}
                sub="12h"
                size={108}
                stroke={8}
              />
              <div className="min-w-0 flex-1">
                <Field label="Lead time" value={`${metrics.leadTimeMin} min`} tone="text-primary" />
                <Field label="Confidence" value={`${metrics.confidence.toFixed(0)}%`} />
                {kind !== 'flood' ? (
                  <p className="mt-1 font-sans text-[10px] text-muted-foreground">
                    Downstream flood context for this {kind} site. Not a settlement forecast.
                  </p>
                ) : null}
              </div>
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Active alerts" />
            <div className="flex flex-col gap-1.5 p-2">
              {alerts.map((a) => (
                <div
                  key={a.id}
                  className="rounded-sm border border-panel-border bg-muted/25 p-2"
                  style={{ borderLeftColor: `var(--color-${a.severity})`, borderLeftWidth: 2 }}
                >
                  <div className="flex justify-between gap-2">
                    <HazardBadge level={a.severity} />
                    <span className="font-mono text-[9px] text-muted-foreground">sim · {a.issuedMinAgo}m</span>
                  </div>
                  <div className="mt-1 font-sans text-[12px] font-semibold">{a.title}</div>
                  <p className="mt-1 font-sans text-[11px] text-muted-foreground">{a.message}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Drivers · simulated SHAP" />
            <div className="flex flex-col gap-2 p-2.5">
              {contributions.map((f) => (
                <div key={f.feature}>
                  <div className="flex justify-between gap-2 font-sans text-[11px]">
                    <span>{f.feature}</span>
                    <span className="font-mono text-muted-foreground">{f.value}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${Math.min(100, f.contribution * 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Response" />
            <div className="p-2.5">
              {evac.map((s) => (
                <div key={s.order} className="font-sans text-[12px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{s.action}</span>
                  <p className="mt-1">{s.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
          {sensors.length > 0 && (
            <Panel>
              <PanelHeader title="Attached sensors" />
              <div className="p-2">
                {sensors.map((s) => (
                  <div key={s.id} className="flex items-center gap-2 px-1 py-1">
                    <StatusDot status={s.status} />
                    <span className="font-mono text-[11px]">{s.name}</span>
                    <span className="ml-auto font-mono text-[11px] text-muted-foreground">
                      {s.status === 'offline' ? '—' : `${s.primaryValue} ${s.unit}`}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          )}
        </>
      )}

      {tab === 'flood' && !metrics && <NoPredictionData coord={emptyClick} />}

      {tab === 'glacier' && (
        glacier ? (
          <Panel>
            <PanelHeader
              title="Glacier monitoring"
              right={<span className="font-mono text-[9px] text-caution">{DATA_MODE}</span>}
            />
            <div className="grid grid-cols-2 gap-x-3 px-3 pb-2">
              <Field label="Glacier" value={glacier.name} />
              <Field label="Location" value={`${loc.district}, ${loc.state}`} />
              <Field label="Elevation" value={`${glacier.elevation} m`} />
              <Field label="Glacier area" value={`${glacier.glacierArea} ${glacier.glacierAreaUnit}`} />
              <Field
                label="Melt rate"
                value={`${glacier.estimatedMeltRate.toFixed(2)} ${glacier.meltRateUnit}`}
                tone="text-caution"
              />
              <Field
                label="Trend"
                value={glacier.meltTrend === 'increasing' ? '↑ Increasing' : glacier.meltTrend === 'decreasing' ? '↓ Decreasing' : '→ Stable'}
              />
              <Field label="Temperature" value={`${glacier.temperature.toFixed(1)} °C`} />
              <Field label="Ice/snow coverage" value={`${glacier.snowIceCoverage}%`} />
              <Field label="Historical baseline" value={`${glacier.historicalBaseline} m/day`} />
              <Field
                label="Change from baseline"
                value={`${glacier.changeFromBaseline > 0 ? '+' : ''}${glacier.changeFromBaseline}%`}
                tone="text-caution"
              />
              <Field label="Downstream flood risk" value={glacier.downstreamRisk.toUpperCase()} />
              <Field label="Last observation" value={glacier.observationTime.replace('T', ' ').slice(0, 16)} />
              <Field label="Data status" value="SIMULATED / PROTOTYPE" tone="text-caution" />
            </div>
            <p className="border-t border-panel-border px-3 py-2 font-sans text-[11px] text-muted-foreground">
              {glacier.notes}
            </p>
          </Panel>
        ) : (
          <Panel className="p-3">
            <p className="font-sans text-[12px] text-muted-foreground">
              No glacier monitoring record is attached to this location.
            </p>
          </Panel>
        )
      )}

      {tab === 'lake' && (
        lake ? (
          <Panel>
            <PanelHeader
              title="Lake / water body"
              right={<span className="font-mono text-[9px] text-caution">{DATA_MODE}</span>}
            />
            <div className="grid grid-cols-2 gap-x-3 px-3 pb-2">
              <Field label="Water body" value={lake.name} />
              <Field label="Type" value={WATER_BODY_TYPE_LABEL[lake.type]} />
              <Field
                label="Current water level"
                value={`${lake.currentWaterLevel.toFixed(1)} ${lake.levelUnit}`}
              />
              <Field
                label="Reference level"
                value={`${lake.referenceWaterLevel.toFixed(1)} ${lake.levelUnit}`}
              />
              <Field
                label="Level anomaly"
                value={`${lake.levelAnomaly > 0 ? '+' : ''}${lake.levelAnomaly.toFixed(1)} ${lake.levelUnit}`}
                tone="text-caution"
              />
              <Field
                label="Rate of rise"
                value={`${lake.rateOfRise.toFixed(1)} ${lake.rateOfRiseUnit}`}
              />
              <Field label="Trend" value={lake.trend.toUpperCase()} />
              <Field label="Overflow risk" value={lake.overflowRisk.toUpperCase()} />
              <Field label="Catchment rainfall" value={`${lake.catchmentRainfall} mm/h`} />
              <Field label="Downstream risk" value={lake.downstreamRisk.toUpperCase()} />
              <Field label="Elevation" value={`${lake.elevation} m`} />
              <Field label="Last observation" value={lake.observationTime.replace('T', ' ').slice(0, 16)} />
              <Field label="Data status" value="SIMULATED / PROTOTYPE" tone="text-caution" />
            </div>
            <p className="border-t border-panel-border px-3 py-2 font-sans text-[11px] text-muted-foreground">
              {lake.notes}
            </p>
          </Panel>
        ) : (
          <Panel className="p-3">
            <p className="font-sans text-[12px] text-muted-foreground">
              No lake / water-body monitoring record is attached to this location.
            </p>
          </Panel>
        )
      )}

      {tab === 'landslide' && (
        <Panel>
          <PanelHeader title="Landslide prediction" />
          <Placeholder title="Landslide Prediction" />
        </Panel>
      )}
      {tab === 'river' && (
        <Panel>
          <PanelHeader title="River path monitoring" />
          <Placeholder title="River Path Monitoring" />
        </Panel>
      )}
    </div>
  )
}
