'use client'

import { Siren } from 'lucide-react'
import { DATA_MODE, listAlerts } from '@/lib/service'
import { Panel, PanelHeader, HazardBadge } from './hud'

export function AlertsFeed({ locationId }: { locationId: string | null }) {
  const alerts = listAlerts(locationId)

  return (
    <Panel>
      <PanelHeader
        title="Active Alerts"
        icon={<Siren />}
        right={
          <span className="rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-panel-border">
            {DATA_MODE}
          </span>
        }
      />
      <div className="flex flex-col gap-1.5 p-2.5">
        {alerts.length === 0 ? (
          <p className="px-1 py-2 font-sans text-[12px] text-muted-foreground">
            No alert record for this location.
          </p>
        ) : (
          alerts.map((a) => (
            <div
              key={a.id}
              className="rounded-sm border border-panel-border bg-muted/25 p-2.5"
              style={{ borderLeftColor: `var(--color-${a.severity})`, borderLeftWidth: 2 }}
            >
              <div className="flex items-center justify-between gap-2">
                <HazardBadge level={a.severity} pulse />
                <span className="font-mono text-[10px] text-muted-foreground">
                  simulated · {a.issuedMinAgo}m
                </span>
              </div>
              <div className="mt-1.5 font-sans text-[12px] font-semibold leading-snug text-foreground text-pretty">
                {a.title}
              </div>
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                {a.location}
              </div>
              <p className="mt-1 font-sans text-[11px] leading-relaxed text-muted-foreground text-pretty">
                {a.message}
              </p>
            </div>
          ))
        )}
      </div>
    </Panel>
  )
}
