import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
  eyebrow,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="page-header mb-8 flex flex-col gap-5 border-b border-sky-100 pb-7 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>}
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-[38px] md:leading-tight">{title}</h1>
        <p className="mt-2 text-base leading-7 text-muted md:text-lg">{description}</p>
      </div>
      {action && <div className="flex shrink-0 flex-wrap items-center gap-3">{action}</div>}
    </div>
  );
}

const tones = {
  sky: 'bg-sky-50 text-sky-600 border-sky-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
};

export function StatCard({
  label,
  value,
  icon: Icon,
  detail,
  tone = 'sky',
  trend,
  progress,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  detail: string;
  tone?: keyof typeof tones;
  trend?: string;
  progress?: number;
}) {
  return (
    <div className="card group relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-sky-300/60 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">{label}</p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <p className="text-4xl font-bold leading-none tracking-tight text-ink">{value}</p>
            {trend && (
              <span className="mb-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
                {trend}
              </span>
            )}
          </div>
        </div>
        <span className={`rounded-2xl border p-3 ${tones[tone]}`}>
          <Icon size={23} />
        </span>
      </div>
      {typeof progress === 'number' && (
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-400"
            style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }}
          />
        </div>
      )}
      <p className={`${typeof progress === 'number' ? 'mt-3' : 'mt-6 border-t border-slate-100 pt-4'} text-sm text-muted`}>
        {detail}
      </p>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const c =
    status === 'approved'
      ? 'border-green-200 bg-green-50 text-green-700'
      : status === 'rejected'
        ? 'border-red-200 bg-red-50 text-red-700'
        : 'border-amber-200 bg-amber-50 text-amber-700';
  return (
    <span className={`badge border ${c}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status.replace('_', ' ')}
    </span>
  );
}

export function AiNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-sky-50 p-5 shadow-sm">
      <div className="flex gap-3">
        <span className="h-fit rounded-xl bg-white p-2 text-accent shadow-sm">
          <Sparkles size={20} />
        </span>
        <div>
          <p className="font-bold text-emerald-900">AI Finding</p>
          <div className="mt-1 text-sm leading-6 text-emerald-800">{children}</div>
          <p className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-700">
            <AlertTriangle size={14} /> Requires human validation
          </p>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="card py-16 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-sky-50 text-primary">
        <CheckCircle2 />
      </span>
      <h3 className="mt-4 font-bold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </div>
  );
}
