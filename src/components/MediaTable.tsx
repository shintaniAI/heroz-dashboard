import { num, pct, numOr0 } from "@/lib/config";
import type { MediaRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  title: string;
  rows: MediaRow[];
  total?: MediaRow | null;
  spreadsheetId: string;
  max?: number;
};

export function MediaTable({
  title,
  rows,
  total,
  spreadsheetId,
  max = 30,
}: Props) {
  const sorted = [...rows]
    .sort((a, b) => numOr0(b.actual.value) - numOr0(a.actual.value))
    .slice(0, max);

  const maxActual = sorted.reduce(
    (m, r) => Math.max(m, numOr0(r.actual.value), numOr0(r.target.value)),
    1
  );

  const diffVal = (r: MediaRow) => numOr0(r.actual.value) - numOr0(r.target.value);
  const diffGenjiten = (r: MediaRow) =>
    numOr0(r.actual.value) - numOr0(r.genjiten.value);

  const renderRow = (r: MediaRow, isTotal = false) => {
    const barPct = Math.max(
      0,
      Math.min(100, (numOr0(r.actual.value) / maxActual) * 100)
    );
    const vsGenjiten =
      numOr0(r.genjiten.value) > 0
        ? numOr0(r.actual.value) / numOr0(r.genjiten.value)
        : NaN;
    const tone =
      isFinite(vsGenjiten) && vsGenjiten >= 0.95
        ? "bg-ok"
        : isFinite(vsGenjiten) && vsGenjiten >= 0.8
        ? "bg-warn"
        : "bg-bad";
    const d = diffVal(r);
    const dg = diffGenjiten(r);
    const baseCls = isTotal
      ? "py-1.5 text-ink font-semibold bg-canvas/40"
      : "py-1.5 text-ink";
    return (
      <tr
        key={r.name + (isTotal ? "-total" : "")}
        className={`border-t border-line-soft ${isTotal ? "bg-canvas/40" : ""}`}
      >
        <td className={`${baseCls} pl-2 text-[11px]`}>{r.name}</td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.target}
            spreadsheetId={spreadsheetId}
            display={num(r.target.value)}
            className="num text-ink-4 text-[11px]"
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.genjiten}
            spreadsheetId={spreadsheetId}
            display={num(r.genjiten.value)}
            className="num text-ink-4 text-[11px]"
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.actual}
            spreadsheetId={spreadsheetId}
            display={num(r.actual.value)}
            className={`num text-[11px] ${isTotal ? "text-ink font-bold" : "text-ink font-semibold"}`}
          />
        </td>
        <td
          className={`${baseCls} text-right num text-[11px] ${
            dg < 0 ? "text-bad" : "text-ok"
          }`}
        >
          {dg >= 0 ? "+" : ""}
          {num(dg)}
        </td>
        <td
          className={`${baseCls} text-right num text-[11px] ${
            d < 0 ? "text-bad" : "text-ok"
          }`}
        >
          {d >= 0 ? "+" : ""}
          {num(d)}
        </td>
        <td className={`${baseCls} text-right`}>
          <span className="num text-ink-2 text-[11px]">
            {pct(vsGenjiten, 0)}
          </span>
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.progress}
            spreadsheetId={spreadsheetId}
            display={pct(r.progress.value, 0)}
            className="num text-ink-3 text-[11px]"
          />
        </td>
        <td className={`${baseCls} pr-2`}>
          <div className="h-1.5 bg-line-soft rounded-full overflow-hidden">
            <div
              className={`h-full ${tone}`}
              style={{ width: `${barPct}%` }}
            />
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="panel p-3">
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <div className="label text-[10px]">Media</div>
          <h3 className="display-serif text-base text-ink">{title}</h3>
        </div>
        <span className="label text-ink-muted text-[10px]">
          {rows.length}媒体
        </span>
      </div>
      <div className="overflow-x-auto -mx-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft text-[9.5px]">
              <th className="text-left pl-2 pb-1 font-semibold">媒体</th>
              <th className="text-right pb-1 font-semibold">月目標</th>
              <th className="text-right pb-1 font-semibold">現時点目標</th>
              <th className="text-right pb-1 font-semibold">実績</th>
              <th className="text-right pb-1 font-semibold">差異(実-現)</th>
              <th className="text-right pb-1 font-semibold">差異(実-月)</th>
              <th className="text-right pb-1 font-semibold">現達成率<br/>実÷現</th>
              <th className="text-right pb-1 font-semibold">月達成率<br/>実÷月</th>
              <th className="pr-2 pb-1 font-semibold w-20">達成</th>
            </tr>
          </thead>
          <tbody>
            {total && renderRow(total, true)}
            {sorted.map((r) => renderRow(r))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
