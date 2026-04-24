import { num, yen } from "@/lib/config";

type Row = { name: string; tanka: number; ninzu: number; uriage: number };

export function PlanTable({ rows }: { rows: Row[] }) {
  const total = rows.reduce((s, r) => s + r.uriage, 0);
  const sorted = [...rows].sort((a, b) => b.uriage - a.uriage);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <div className="label-caps text-ink-secondary">Plans</div>
        <h3 className="text-base font-semibold text-ink mt-1">プラン別売上</h3>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="label-caps text-ink-muted">
              <th className="text-left pl-5 pb-2 font-semibold">プラン</th>
              <th className="text-right pb-2 font-semibold">単価</th>
              <th className="text-right pb-2 font-semibold">人数</th>
              <th className="text-right pb-2 font-semibold">売上</th>
              <th className="text-right pr-5 pb-2 font-semibold">構成比</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-line">
                <td className="py-2.5 pl-5 text-ink-secondary">{r.name}</td>
                <td className="py-2.5 text-right num text-ink-tertiary">{yen(r.tanka)}</td>
                <td className="py-2.5 text-right num text-ink-secondary">{num(r.ninzu)}</td>
                <td className="py-2.5 text-right num text-ink font-semibold">{yen(r.uriage)}</td>
                <td className="py-2.5 text-right pr-5 num text-ink-tertiary">
                  {total > 0 ? `${((r.uriage / total) * 100).toFixed(1)}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line-strong">
              <td className="py-3 pl-5 label-caps text-ink-secondary">合計</td>
              <td colSpan={2}></td>
              <td className="py-3 text-right num text-ink font-semibold">{yen(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
