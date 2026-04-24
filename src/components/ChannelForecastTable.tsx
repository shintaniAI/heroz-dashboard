import { num, yen, pct, numOr0 } from "@/lib/config";
import type { ChannelForecastRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = { rows: ChannelForecastRow[]; spreadsheetId: string };

export function ChannelForecastTable({ rows, spreadsheetId }: Props) {
  const sorted = [...rows].sort(
    (a, b) => numOr0(b.yoyaku.value) - numOr0(a.yoyaku.value)
  );

  return (
    <div className="panel p-2">
      <div className="flex items-baseline justify-between mb-1">
        <h3 className="display-serif text-sm text-ink leading-tight">
          媒体別予約予測 — 予約/面談/契約/CPA/CPO
        </h3>
        <span className="label text-ink-muted text-[9.5px]">
          {rows.length}媒体
        </span>
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft text-[9.5px]">
              <th className="text-left pl-2 pb-1 font-semibold">媒体</th>
              <th className="text-right pb-1 font-semibold">予約</th>
              <th className="text-right pb-1 font-semibold">ｷｬﾝｾﾙ率</th>
              <th className="text-right pb-1 font-semibold">面談</th>
              <th className="text-right pb-1 font-semibold">契約率</th>
              <th className="text-right pb-1 font-semibold">契約</th>
              <th className="text-right pb-1 font-semibold">広告費</th>
              <th className="text-right pb-1 font-semibold">予約CPA</th>
              <th className="text-right pb-1 font-semibold">面談CPA</th>
              <th className="text-right pr-2 pb-1 font-semibold">CPO</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.name} className="border-t border-line-soft">
                <td className="py-1 pl-2 text-ink-2 text-[11px] truncate max-w-[120px]">
                  {r.name}
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.yoyaku}
                    spreadsheetId={spreadsheetId}
                    display={num(r.yoyaku.value)}
                    className="num text-ink text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.cancelRate}
                    spreadsheetId={spreadsheetId}
                    display={pct(r.cancelRate.value, 0)}
                    className="num text-ink-4 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.menuaiSu}
                    spreadsheetId={spreadsheetId}
                    display={num(r.menuaiSu.value)}
                    className="num text-ink-3 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.keiyakuRate}
                    spreadsheetId={spreadsheetId}
                    display={pct(r.keiyakuRate.value, 0)}
                    className="num text-ink-4 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.keiyakuSu}
                    spreadsheetId={spreadsheetId}
                    display={num(r.keiyakuSu.value)}
                    className="num text-ink font-semibold text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.kokokuHi}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.kokokuHi.value)}
                    className="num text-ink-4 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.yoyakuCpa}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.yoyakuCpa.value)}
                    className="num text-ink-3 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right">
                  <Ref
                    src={r.menuaiCpa}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.menuaiCpa.value)}
                    className="num text-ink-3 text-[11px]"
                  />
                </td>
                <td className="py-1 text-right pr-2">
                  <Ref
                    src={r.cpo}
                    spreadsheetId={spreadsheetId}
                    display={yen(r.cpo.value)}
                    className="num text-accent font-semibold text-[11px]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
