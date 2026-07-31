import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ClipboardCheck,
  Images,
  PackagePlus,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/client';
import { EmptyState, PageHeader, StatCard, StatusBadge } from '../components/ui';
import type { Dashboard } from '../types';

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  const dashboardInsights = useMemo(() => {
    if (!data) return null;

    const defects = new Map<string, number>();
    let weightedConfidence = 0;
    let inspectedImages = 0;

    data.recent_batches.forEach((batch) => {
      Object.entries(batch.metrics.defect_counts).forEach(([name, count]) => {
        defects.set(name, (defects.get(name) ?? 0) + count);
      });
      const validImages = batch.metrics.images_processed - batch.metrics.invalid;
      weightedConfidence += batch.metrics.average_confidence * validImages;
      inspectedImages += validImages;
    });

    return {
      confidence: inspectedImages ? Math.round((weightedConfidence / inspectedImages) * 100) : 0,
      reviewRate: data.total_batches ? Math.round((data.needs_review / data.total_batches) * 100) : 0,
      defects: [...defects.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [data]);

  if (!data || !dashboardInsights) {
    return (
      <div className="grid min-h-[420px] place-items-center">
        <div className="text-center">
          <span className="mx-auto block h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-primary" />
          <p className="mt-4 text-sm font-semibold text-muted">Loading quality intelligence…</p>
        </div>
      </div>
    );
  }

  const maxDefect = Math.max(1, ...dashboardInsights.defects.map(([, count]) => count));

  return (
    <>
      <PageHeader
        eyebrow="Inspection overview"
        title="Quality Dashboard"
        description="Real-time pharmaceutical packaging quality metrics, defect intelligence, and human review status."
        action={
          <>
            <span className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 xl:inline-flex">
              <Sparkles size={17} /> AI Inspector Active
            </span>
            <Link className="btn-primary" to="/create">
              <PackagePlus size={18} /> Start inspection batch
            </Link>
          </>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Overall pass rate"
          value={`${data.overall_quality}%`}
          icon={TrendingUp}
          detail="Across all analyzed package images"
          tone="emerald"
          progress={data.overall_quality}
        />
        <StatCard
          label="Batches analyzed"
          value={data.total_batches}
          icon={Boxes}
          detail={`${data.total_images.toLocaleString()} processed · ${data.invalid_images} invalid excluded`}
          tone="sky"
        />
        <StatCard
          label="Active review queue"
          value={data.needs_review}
          icon={AlertTriangle}
          detail={data.needs_review ? 'Requires human validation' : 'No batches awaiting review'}
          tone={data.needs_review ? 'rose' : 'emerald'}
          progress={dashboardInsights.reviewRate}
        />
        <StatCard
          label="Average AI confidence"
          value={`${dashboardInsights.confidence}%`}
          icon={ShieldCheck}
          detail="Weighted across recent inspections"
          tone="emerald"
          progress={dashboardInsights.confidence}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card lg:col-span-2">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Quality performance</p>
              <h2 className="mt-1 text-xl font-bold text-ink">Inspection health overview</h2>
              <p className="mt-1 text-sm text-muted">Live rollup from all recorded inspection batches</p>
            </div>
            <span className="badge self-start border border-sky-100 bg-sky-50 text-sky-700 sm:self-auto">Current dataset</span>
          </div>

          <div className="grid gap-8 py-6 md:grid-cols-[220px_1fr] md:items-center">
            <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(#10b981 ${data.overall_quality * 3.6}deg, #e0f2fe 0deg)` }}>
              <div className="grid h-32 w-32 place-items-center rounded-full bg-white shadow-inner">
                <div className="text-center">
                  <p className="text-4xl font-bold tracking-tight text-ink">{data.overall_quality}%</p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">Pass rate</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <MetricRow
                label="Images processed"
                value={data.total_images.toLocaleString()}
                percent={data.total_images ? 100 : 0}
                color="bg-sky-500"
              />
              <MetricRow
                label="AI confidence"
                value={`${dashboardInsights.confidence}%`}
                percent={dashboardInsights.confidence}
                color="bg-emerald-500"
              />
              <MetricRow
                label="Batches cleared from queue"
                value={`${Math.max(data.total_batches - data.needs_review, 0)} / ${data.total_batches}`}
                percent={100 - dashboardInsights.reviewRate}
                color="bg-indigo-500"
              />
            </div>
          </div>

          <div className="grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
            <SummaryPill icon={CheckCircle2} label="Quality monitoring" value="Active" color="text-emerald-600 bg-emerald-50" />
            <SummaryPill icon={ClipboardCheck} label="Human validation" value={`${data.needs_review} pending`} color="text-amber-600 bg-amber-50" />
            <SummaryPill icon={Images} label="Evidence captured" value={`${data.total_images} images`} color="text-sky-600 bg-sky-50" />
          </div>
        </section>

        <section className="card">
          <div className="border-b border-slate-100 pb-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Defect intelligence</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Category overview</h2>
            <p className="mt-1 text-sm text-muted">Detected issues in recent batches</p>
          </div>

          {dashboardInsights.defects.length ? (
            <div className="mt-6 space-y-5">
              {dashboardInsights.defects.slice(0, 5).map(([name, count], index) => (
                <div key={name}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-slate-700">{name}</span>
                    <span className="font-bold text-ink">{count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${index === 0 ? 'bg-rose-500' : index === 1 ? 'bg-amber-400' : 'bg-sky-500'}`}
                      style={{ width: `${Math.max(8, (count / maxDefect) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center text-center">
              <div>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={26} />
                </span>
                <p className="mt-4 font-bold text-ink">No defects recorded</p>
                <p className="mt-1 text-sm text-muted">Recent inspection evidence is clear.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">Traceability</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Recent inspection batches</h2>
          </div>
          {data.recent_batches.length > 0 && (
            <Link to="/batches" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-sky-700">
              View all <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {data.recent_batches.length === 0 ? (
          <EmptyState title="No batches yet" text="Create your first inspection batch to begin." />
        ) : (
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-6 py-4">Batch</th>
                    <th>Production line</th>
                    <th>Shift</th>
                    <th>Images</th>
                    <th>Confidence</th>
                    <th>Quality score</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data.recent_batches.map((batch) => (
                    <tr key={batch.id} className="border-t border-slate-100 transition hover:bg-sky-50/40">
                      <td className="px-6 py-4">
                        <Link className="font-bold text-ink hover:text-primary" to={`/batches/${batch.id}`}>
                          {batch.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted">{new Date(batch.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="font-medium text-slate-600">{batch.production_line}</td>
                      <td className="text-slate-600">{batch.shift}</td>
                      <td className="font-semibold text-slate-700">{batch.metrics.images_processed}</td>
                      <td className="font-semibold text-slate-700">{Math.round(batch.metrics.average_confidence * 100)}%</td>
                      <td>
                        <span className="font-bold text-ink">{batch.metrics.quality_score}%</span>
                      </td>
                      <td><StatusBadge status={batch.status} /></td>
                      <td className="pr-6 text-right">
                        <Link to={`/batches/${batch.id}`} className="inline-grid h-8 w-8 place-items-center rounded-lg text-primary hover:bg-sky-100" aria-label={`View ${batch.name}`}>
                          <ArrowRight size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function MetricRow({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className="font-bold text-ink">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.max(0, Math.min(percent, 100))}%` }} />
      </div>
    </div>
  );
}

function SummaryPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <span className={`rounded-lg p-2 ${color}`}><Icon size={17} /></span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
        <p className="text-sm font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}
