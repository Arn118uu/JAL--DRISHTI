'use client'

import {
  Activity,
  AlertTriangle,
  Bell,
  Database,
  HeartPulse,
  History,
  LayoutDashboard,
  Map,
  Mountain,
  Radio,
  Route,
  Snowflake,
  Users,
  Waves,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavId =
  | 'command'
  | 'map'
  | 'flood'
  | 'alerts'
  | 'sensors'
  | 'settlements'
  | 'evac'
  | 'history'
  | 'scenario'
  | 'sources'
  | 'health'
  | 'glacier'
  | 'lake'
  | 'landslide'
  | 'river'

const GROUPS: { title: string; items: { id: NavId; label: string; icon: React.ReactNode; ready: boolean }[] }[] =
  [
    {
      title: 'Operations',
      items: [
        { id: 'command', label: 'Command Center', icon: <LayoutDashboard />, ready: true },
        { id: 'map', label: 'Live Risk Map', icon: <Map />, ready: true },
        { id: 'flood', label: 'Flood Prediction', icon: <Activity />, ready: true },
        { id: 'alerts', label: 'Active Alerts', icon: <Bell />, ready: true },
      ],
    },
    {
      title: 'Monitoring',
      items: [
        { id: 'glacier', label: 'Glacier Monitoring', icon: <Snowflake />, ready: true },
        { id: 'lake', label: 'Lake & Water Bodies', icon: <Waves />, ready: true },
        { id: 'landslide', label: 'Landslide Prediction', icon: <Mountain />, ready: false },
        { id: 'river', label: 'River Path Monitoring', icon: <Route />, ready: false },
        { id: 'sensors', label: 'Sensor Network', icon: <Radio />, ready: true },
        { id: 'settlements', label: 'Settlement Risk', icon: <Users />, ready: true },
      ],
    },
    {
      title: 'Response',
      items: [
        { id: 'evac', label: 'Evacuation Planning', icon: <AlertTriangle />, ready: true },
        { id: 'history', label: 'Historical Analytics', icon: <History />, ready: false },
        { id: 'scenario', label: 'Scenario Simulator', icon: <Activity />, ready: false },
      ],
    },
    {
      title: 'System',
      items: [
        { id: 'sources', label: 'Data Sources', icon: <Database />, ready: false },
        { id: 'health', label: 'System Health', icon: <HeartPulse />, ready: false },
      ],
    },
  ]

export function AppSidebar({
  active,
  onChange,
}: {
  active: NavId
  onChange: (id: NavId) => void
}) {
  return (
    <aside className="flex h-full w-[13.5rem] shrink-0 flex-col border-r border-panel-border bg-sidebar">
      <div className="border-b border-panel-border px-3 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-sm bg-primary/15 ring-1 ring-primary/35">
            <Waves className="size-4 text-primary" />
          </div>
          <div className="leading-none">
            <div className="font-sans text-[13px] font-bold tracking-[0.12em] text-foreground">
              JAL-DRISHTI
            </div>
            <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
              NDRF · USDMA
            </div>
          </div>
        </div>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        {GROUPS.map((g) => (
          <div key={g.title} className="mb-3">
            <div className="px-2 pb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {g.title}
            </div>
            {g.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={cn(
                  'mb-0.5 flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left font-sans text-[12px] transition-colors',
                  active === item.id
                    ? 'bg-primary/12 text-primary ring-1 ring-inset ring-primary/30'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <span className="[&>svg]:size-3.5">{item.icon}</span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {!item.ready ? (
                  <span className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground">
                    soon
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ))}
      </nav>
      <div className="border-t border-panel-border px-3 py-2">
        <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">
          Data mode
        </div>
        <div className="mt-0.5 font-mono text-[10px] font-semibold text-caution">
          SIMULATED / PROTOTYPE
        </div>
      </div>
    </aside>
  )
}
