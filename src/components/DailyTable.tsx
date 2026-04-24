import { num, numOr0 } from "@/lib/config";
import type { DailyRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = { rows: DailyRow[]; spreadsheetId: string };

export function DailyTable({ rows, spreadsheetId }: Props) {
  const totalTarget = rows.reduce((s, r) => s + numOr0(r.target.value), 0);
  const totalRes = rows.reduce((s, r) => s + numOr0(r.reservation.value), 0);
  const totalActual = rows.reduce((s, r) => s + numOr0(r.actualRes.value), 0);
  const totalDiff = totalActual - totalTarget;

  return (
    <div className="panel p-3">
      <div className="mb-2">
        <div className="label text-[10px]">Daily</div>
        <h3 className="display-serif text-base text-ink">
          日次 — 予約目標 / 実予約 / 差異
        </h3>
      </div>
      <div className="overflow-x-auto -mx-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft text-[9.5px]">
              <th className="text-left pl-2 pb-1 font-semibold">日付</th>
              <th className="text-left pb-1 font-semibold">曜</th>
              <th className="text-right pb-1 font-semibold">予約目標</th>
              <th className="text-right pb-1 font-semibold">総予約</th>
              <th className="text-right pb-1 font-semibold">実予約</th>
              <th className="text-right pb-1 font-semibold pr-2">
                差異(実-目)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const diff =
                numOr0(r.actualRes.value) - numOr0(r.target.value);
              return (
                <tr key={i} className="border-t border-line-soft">
                  <td className="py-1.5 pl-2 text-ink-2 text-[11px] num">
                    {r.date}
                  </td>
                  <td className="py-1.5 text-ink-4 text-[11px]">{r.dow}</td>
                  <td className="py-1.5 text-right">
                    <Ref
                      src={r.target}
                      spreadsheetId={spreadsheetId}
                      display={num(r.target.value)}
                      className="num text-ink-4 text-[11px]"
                    />
                  </td>
                  <td className="py-1.5 text-right">
                    <Ref
                      src={r.reservation}
                      spreadsheetId={spreadsheetId}
                      display={num(r.reservation.value)}
                      className="num text-ink-3 text-[11px]"
                    />
                  </td>
                  <td className="py-1.5 text-right">
                    <Ref
                      src={r.actualRes}
                      spreadsheetId={spreadsheetId}
                      display={num(r.actualRes.value)}
                      className="num text-ink font-semibold text-[11px]"
                    />
                  </td>
                  <td
                    className={`py-1.5 text-right pr-2 num text-[11px] ${
                      diff < 0 ? "text-bad" : "text-ok"
                    }`}
                  >
                    {diff >= 0 ? "+" : ""}
                    {num(diff)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-line">
              <td className="py-1.5 pl-2 label text-ink-2 text-[10px]" colSpan={2}>
                合計
              </td>
              <td className="py-1.5 text-right num text-ink text-[11px] font-semibold">
                {num(totalTarget)}
              </td>
              <td className="py-1.5 text-right num text-ink-3 text-[11px]">
                {num(totalRes)}
              </td>
              <td className="py-1.5 text-right num text-ink text-[11px] font-semibold">
                {num(totalActual)}
              </td>
              <td
                className={`py-1.5 text-right pr-2 num text-[11px] font-semibold ${
                  totalDiff < 0 ? "text-bad" : "text-ok"
                }`}
              >
                {totalDiff >= 0 ? "+" : ""}
                {num(totalDiff)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
