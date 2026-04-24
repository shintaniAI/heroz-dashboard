import { num, yen, numOr0 } from "@/lib/config";
import type { PlanRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = { rows: PlanRow[]; spreadsheetId: string };

export function PlanTable({ rows, spreadsheetId }: Props) {
  const total = rows.reduce((s, r) => s + numOr0(r.uriage.value), 0);
  const sorted = [...rows].sort(
    (a, b) => numOr0(b.uriage.value) - numOr0(a.uriage.value)
  );

  return (
    <div className="panel p-2">
      <h3 className="display-serif text-sm text-ink leading-tight mb-1">プラン別売上</h3>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft text-[9.5px]">
              <th className="text-left pl-2 pb-1 font-semibold">プラン</th>
              <th className="text-right pb-1 font-semibold">単価</th>
              <th className="text-right pb-1 font-semibold">人数</th>
              <th className="text-right pb-1 font-semibold">売上</th>
              <th className="text-right pr-2 pb-1 font-semibold">構成比</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-line-soft">
                <td className="py-1 pl-2 text-ink-2 text-[11px]">{r.name}</td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.tanka}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.tanka.value)}
                    className="num text-ink-4 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.ninzu}
                    spreadsheetId={spreadsheetId}
                    display={num(r.ninzu.value)}
                    className="num text-ink-2 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.uriage}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.uriage.value)}
                    className="num text-ink font-semibold text-[11px]"
                  />
                </td>
                <td className="py-1 text-right pr-2 num text-ink-4 text-[11px]">
                  {total > 0 ? `${((numOr0(r.uriage.value) / total) * 100).toFixed(1)}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="py-1 pl-2 label text-ink-2 text-[10px]">合計</td>
              <td colSpan={2}></td>
              <td className="py-1 text-right num text-ink font-semibold text-[11px]">{yen(total)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
