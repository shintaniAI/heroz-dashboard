import { num, yen } from "@/lib/config";

type Row = { name: string; tanka: number; ninzu: number; uriage: number };

export function PlanTable({ rows }: { rows: Row[] }) {
  const total = rows.reduce((s, r) => s + r.uriage, 0);
  const sorted = [...rows].sort((a, b) => b.uriage - a.uriage);

  return (
    <div className="card p-5">
      <h3 className="font-semibold text-slate-200 mb-3">プラン別売上</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-slate-400 border-b border-slate-700">
            <th className="text-left py-2 font-normal">プラン</th>
            <th className="text-right py-2 font-normal">単価</th>
            <th className="text-right py-2 font-normal">人数</th>
            <th className="text-right py-2 font-normal">売上</th>
            <th className="text-right py-2 font-normal">構成比</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.name} className="border-b border-slate-800">
              <td className="py-2 text-slate-200">{r.name}</td>
              <td className="py-2 text-right tabular-nums text-slate-400">{yen(r.tanka)}</td>
              <td className="py-2 text-right tabular-nums text-slate-300">{num(r.ninzu)}</td>
              <td className="py-2 text-right tabular-nums text-white font-medium">{yen(r.uriage)}</td>
              <td className="py-2 text-right tabular-nums text-slate-400">
                {total > 0 ? `${((r.uriage / total) * 100).toFixed(1)}%` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-600">
            <td className="py-2 font-medium text-slate-300">合計</td>
            <td colSpan={2}></td>
            <td className="py-2 text-right tabular-nums text-white font-bold">{yen(total)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
