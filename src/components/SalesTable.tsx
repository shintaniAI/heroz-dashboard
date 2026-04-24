import { num, pct } from "@/lib/config";
import { ProgressBar } from "./ProgressBar";

type Row = { name: string; menuai: number; keiyaku: number; rate: number };

export function SalesTable({ rows }: { rows: Row[] }) {
  const maxMenuai = Math.max(...rows.map((r) => r.menuai), 1);
  const sorted = [...rows].sort((a, b) => b.rate - a.rate);

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-200 mb-3">営業員別実績</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="text-left py-2 font-normal">氏名</th>
            <th className="text-right py-2 font-normal">面談数</th>
            <th className="text-right py-2 font-normal">契約数</th>
            <th className="text-right py-2 font-normal">契約率</th>
            <th className="py-2 font-normal w-32">面談ボリューム</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-slate-800">
              <td className="py-2 text-slate-200">{r.name}</td>
              <td className="py-2 text-right tabular-nums text-slate-300">{num(r.menuai)}</td>
              <td className="py-2 text-right tabular-nums text-white font-medium">{num(r.keiyaku)}</td>
              <td className="py-2 text-right tabular-nums">
                <span className={r.rate >= 0.3 ? "text-emerald-400" : r.rate >= 0.2 ? "text-amber-400" : "text-rose-400"}>
                  {pct(r.rate, 1)}
                </span>
              </td>
              <td className="py-2"><ProgressBar value={r.menuai} max={maxMenuai} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
