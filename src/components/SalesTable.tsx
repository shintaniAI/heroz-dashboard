import { num, pct } from "@/lib/config";
import { ProgressBar } from "./ProgressBar";

type Row = { name: string; menuai: number; keiyaku: number; rate: number };

export function SalesTable({ rows }: { rows: Row[] }) {
  const maxMenuai = Math.max(...rows.map((r) => r.menuai), 1);
  const sorted = [...rows].sort((a, b) => b.rate - a.rate);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="label-caps text-ink-secondary">Sales Team</div>
        <h3 className="text-base font-semibold text-ink mt-1">営業員別実績</h3>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="label-caps text-ink-muted">
              <th className="text-left pl-5 pb-2 font-semibold">氏名</th>
              <th className="text-right pb-2 font-semibold">面談</th>
              <th className="text-right pb-2 font-semibold">契約</th>
              <th className="text-right pb-2 font-semibold">契約率</th>
              <th className="pr-5 pb-2 font-semibold w-28">Vol.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const rateColor =
                r.rate >= 0.3 ? "text-ok" : r.rate >= 0.2 ? "text-warn" : "text-bad";
              return (
                <tr key={r.name} className="border-t border-line">
                  <td className="py-2.5 pl-5 text-ink-secondary">{r.name}</td>
                  <td className="py-2.5 text-right num text-ink-secondary">{num(r.menuai)}</td>
                  <td className="py-2.5 text-right num text-ink font-semibold">
                    {num(r.keiyaku)}
                  </td>
                  <td className={`py-2.5 text-right num ${rateColor} font-semibold`}>
                    {pct(r.rate, 1)}
                  </td>
                  <td className="py-2.5 pr-5">
                    <ProgressBar value={r.menuai} max={maxMenuai} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
