import { num, pct } from "@/lib/config";
import { ProgressBar } from "./ProgressBar";

type Row = { name: string; target: number; genjiten: number; actual: number; progress: number };

export function MediaTable({ title, rows, max = 15 }: { title: string; rows: Row[]; max?: number }) {
  const sorted = [...rows].sort((a, b) => b.actual - a.actual).slice(0, max);

  return (
    <div className="card p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="label-caps text-ink-secondary">Media</div>
          <h3 className="text-base font-semibold text-ink mt-1">{title}</h3>
        </div>
        <span className="label-caps text-ink-muted">
          {rows.length}媒体 / Top {sorted.length}
        </span>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="label-caps text-ink-muted">
              <th className="text-left pl-5 pb-2 font-semibold">媒体</th>
              <th className="text-right pb-2 font-semibold">目標</th>
              <th className="text-right pb-2 font-semibold">現時点</th>
              <th className="text-right pb-2 font-semibold">実績</th>
              <th className="text-right pb-2 font-semibold">進捗</th>
              <th className="pr-5 pb-2 font-semibold w-24">達成</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-line">
                <td className="py-2.5 pl-5 text-ink-secondary">{r.name}</td>
                <td className="py-2.5 text-right num text-ink-tertiary">{num(r.target)}</td>
                <td className="py-2.5 text-right num text-ink-tertiary">{num(r.genjiten)}</td>
                <td className="py-2.5 text-right num text-ink font-semibold">{num(r.actual)}</td>
                <td className="py-2.5 text-right num text-ink-secondary">{pct(r.progress)}</td>
                <td className="py-2.5 pr-5">
                  <ProgressBar value={r.actual} max={r.target || 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
