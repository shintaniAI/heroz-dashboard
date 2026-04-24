import { num, yen } from "@/lib/config";
import type { PlanRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = { rows: PlanRow[]; spreadsheetId: string };

export function PlanTable({ rows, spreadsheetId }: Props) {
  const total = rows.reduce((s, r) => s + r.uriage.value, 0);
  const sorted = [...rows].sort((a, b) => b.uriage.value - a.uriage.value);

  return (
    <div className="panel p-5">
      <div className="mb-4">
        <div className="label">Plans</div>
        <h3 className="display-serif text-xl text-ink mt-1">プラン別売上</h3>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft">
              <th className="text-left pl-5 pb-2 font-semibold">プラン</th>
              <th className="text-right pb-2 font-semibold">単価</th>
              <th className="text-right pb-2 font-semibold">人数</th>
              <th className="text-right pb-2 font-semibold">売上</th>
              <th className="text-right pr-5 pb-2 font-semibold">構成比</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-line-soft">
                <td className="py-2.5 pl-5 text-ink-2">{r.name}</td>
                <td className="py-2.5 text-right">
                  <Ref
                    src={r.tanka}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.tanka.value)}
                    className="num text-ink-4"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <Ref
                    src={r.ninzu}
                    spreadsheetId={spreadsheetId}
                    display={num(r.ninzu.value)}
                    className="num text-ink-2"
                  />
                </td>
                <td className="py-2.5 text-right">
                  <Ref
                    src={r.uriage}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.uriage.value)}
                    className="num text-ink font-semibold"
                  />
                </td>
                <td className="py-2.5 text-right pr-5 num text-ink-4">
                  {total > 0 ? `${((r.uriage.value / total) * 100).toFixed(1)}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="py-3 pl-5 label text-ink-2">合計</td>
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
