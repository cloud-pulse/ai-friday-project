import { CheckCircle2, Download, ShieldAlert, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBatch, reportUrl, reviewBatch } from '../api/client';
import { AiNotice, PageHeader, StatCard, StatusBadge } from '../components/ui';
import type { Batch } from '../types';

export default function BatchDetailPage() {
  const { id = '' } = useParams();
  const [batch, setBatch] = useState<Batch | null>(null);

  useEffect(() => {
    getBatch(id).then(setBatch);
  }, [id]);

  if (!batch) return <p>Loading batch…</p>;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBatch(
      await reviewBatch(id, {
        inspector_notes: String(form.get('inspector_notes')),
        root_cause: String(form.get('root_cause')),
        corrective_actions: String(form.get('corrective_actions')),
        decision: String(form.get('decision')) as Batch['review']['decision'],
        approved_by: String(form.get('approved_by')),
        reviewed_at: null,
      }),
    );
  }

  return (
    <>
      <PageHeader
        title={batch.name}
        description={`${batch.production_line} · ${batch.shift}`}
        action={
          <div className="flex gap-2">
            <StatusBadge status={batch.status} />
            <a className="btn-secondary" href={reportUrl(batch.id)}>
              <Download size={17} /> PDF report
            </a>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Quality score"
          value={`${batch.metrics.quality_score}%`}
          icon={CheckCircle2}
          detail="Reference-based pass rate"
        />
        <StatCard
          label="Passed"
          value={batch.metrics.passed}
          icon={CheckCircle2}
          detail="No critical issues"
        />
        <StatCard
          label="Failed"
          value={batch.metrics.failed}
          icon={XCircle}
          detail={
            batch.metrics.invalid
              ? `${batch.metrics.invalid} invalid upload(s) excluded`
              : 'Requires validation'
          }
        />
        <StatCard
          label="Confidence"
          value={batch.metrics.average_confidence}
          icon={ShieldAlert}
          detail="Average AI confidence"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="space-y-4">
          <AiNotice>
            {batch.metrics.invalid
              ? `${batch.metrics.invalid} unrelated or invalid image(s) were excluded from quality scoring. `
              : ''}
            {batch.metrics.failed
              ? `${batch.metrics.failed} valid image(s) contain potential defects. Review evidence before final disposition.`
              : 'No visible anomalies were flagged in valid inspection images.'}
          </AiNotice>

          <div className="card overflow-hidden p-0">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-ink">Inspection evidence</h2>
            </div>
            <div className="max-h-[520px] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-sky-50 text-ink">
                  <tr>
                    <th className="px-5 py-3">Image</th>
                    <th>Result</th>
                    <th>Failure details</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.inspections.map((inspection) => (
                    <tr key={inspection.id} className="border-t align-top">
                      <td className="px-5 py-4 font-medium">{inspection.image_name}</td>
                      <td className="py-4">
                        {!inspection.valid_for_inspection ? (
                          <span className="font-semibold text-amber-700">Invalid image</span>
                        ) : inspection.passed ? (
                          <span className="text-green-700">Passed</span>
                        ) : (
                          <span className="text-red-700">Failed</span>
                        )}
                      </td>
                      <td className="max-w-md py-4 pr-4 text-muted">
                        {inspection.defects.length ? (
                          <ul className="list-disc space-y-1 pl-4">
                            {inspection.defects.map((reason) => (
                              <li key={reason}>{reason}</li>
                            ))}
                          </ul>
                        ) : (
                          'None'
                        )}
                      </td>
                      <td className="py-4">{Math.round(inspection.confidence * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="card space-y-4 border-amber-200">
          <div>
            <p className="text-sm font-semibold text-amber-700">Human Review</p>
            <h2 className="mt-1 text-xl font-semibold text-ink">Inspector validation</h2>
          </div>
          <div>
            <label className="label">Inspector notes</label>
            <textarea name="inspector_notes" defaultValue={batch.review.inspector_notes} className="input min-h-24" />
          </div>
          <div>
            <label className="label">Root cause</label>
            <textarea name="root_cause" defaultValue={batch.review.root_cause} className="input min-h-20" />
          </div>
          <div>
            <label className="label">Corrective actions</label>
            <textarea name="corrective_actions" defaultValue={batch.review.corrective_actions} className="input min-h-20" />
          </div>
          <div>
            <label className="label">Final decision</label>
            <select name="decision" defaultValue={batch.review.decision} className="input">
              <option value="pending">Pending</option>
              <option value="approve">Approve</option>
              <option value="hold">Hold</option>
              <option value="reject">Reject</option>
            </select>
          </div>
          <div>
            <label className="label">Approved / reviewed by</label>
            <input name="approved_by" defaultValue={batch.review.approved_by} className="input" />
          </div>
          <button className="btn-primary w-full">Save human review</button>
        </form>
      </div>
    </>
  );
}
