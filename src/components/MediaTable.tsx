import { num, pct } from "@/lib/config";
import { ProgressBar } from "./ProgressBar";

type Row = { name: string; target: number; genjiten: number; actual: number; progress: number };

export function MediaTable({ title, rows, max = 15 }: { title: string; rows: Row[]; max?: number }) {
  const sorted = [...rows]
    .sort((a, b) => b.actual - a.actual)
    .slice(0, max);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <span className="text-xs text-slate-500">{rows.length}媒体 / 上位{sorted.length}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-700">
              <th className="text-left py-2 font-normal">媒体</th>
              <th className="text-right py-2 font-normal">目標</th>
              <th className="text-right py-2 font-normal">現時点</th>
              <th className="text-right py-2 font-normal">実績</th>
              <th className="text-right py-2 font-normal">進捗</th>
              <th className="py-2 font-normal w-24">達成</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-b border-slate-800">
                <td className="py-2 text-slate-200">{r.name}</td>
                <td className="py-2 text-right tabular-nums text-slate-400">{num(r.target)}</td>
                <td className="py-2 text-right tabular-nums text-slate-400">{num(r.genjiten)}</td>
                <td className="py-2 text-right tabular-nums text-white font-medium">{num(r.actual)}</td>
                <td className="py-2 text-right tabular-nums text-slate-300">{pct(r.progress)}</td>
                <td className="py-2"><ProgressBar value={r.actual} max={r.target || 1} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
