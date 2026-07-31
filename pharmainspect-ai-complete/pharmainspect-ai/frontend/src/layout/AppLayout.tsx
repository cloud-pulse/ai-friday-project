import {
  Activity,
  Bell,
  Bot,
  ChevronRight,
  ClipboardCheck,
  LayoutDashboard,
  Menu,
  PackagePlus,
  PanelLeftClose,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  ['Dashboard', '/', LayoutDashboard],
  ['Create Batch', '/create', PackagePlus],
  ['Inspection Batches', '/batches', ClipboardCheck],
  ['AI Assistant', '/assistant', Bot],
] as const;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full flex-col bg-white">
      <div className="flex h-[88px] items-center justify-between border-b px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/20">
            <ShieldCheck size={25} strokeWidth={2.2} />
          </span>
          <div>
            <p className="text-[17px] font-bold tracking-tight text-ink">PharmaInspect</p>
            <p className="text-xs font-medium text-muted">Quality Assurance · AI</p>
          </div>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <PanelLeftClose size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Main navigation
        </p>
        <nav className="mt-3 space-y-1.5">
          {nav.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:bg-sky-50 hover:text-ink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.3 : 2} />
                  <span className="flex-1">{label}</span>
                  {label === 'AI Assistant' && !isActive && (
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                      LIVE
                    </span>
                  )}
                  {isActive && <ChevronRight size={16} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-8 border-t pt-6">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Platform
          </p>
          <div className="mt-3 space-y-2 px-3 text-sm text-slate-500">
            <p className="flex items-center gap-2">
              <Activity size={16} className="text-emerald-500" />
              Inspection engine
              <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.12)]" />
            </p>
            <p className="flex items-center gap-2">
              <Sparkles size={16} className="text-sky-500" />
              AI-assisted review
            </p>
          </div>
        </div>
      </div>

      <div className="m-4 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-emerald-50 p-4">
        <div className="flex items-start gap-3">
          <span className="rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
            <ShieldCheck size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Human validated</p>
            <p className="mt-1 text-xs leading-5 text-muted">
              AI assists with inspection. Final disposition stays with your QA team.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-sky-100 lg:block">
        {sidebar}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-72 shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-sky-100 bg-white/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border bg-white p-2 text-slate-600 shadow-sm lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <div>
              <p className="text-sm font-semibold text-ink">Quality Intelligence Center</p>
              <p className="hidden text-xs text-muted sm:block">Enterprise pharmaceutical inspection workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI Engine Online
            </span>
            <button type="button" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-sm font-bold text-white ring-4 ring-sky-50">
                QI
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-ink">QA Inspector</p>
                <p className="text-xs text-muted">Quality Operations</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-4 md:p-8 xl:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
