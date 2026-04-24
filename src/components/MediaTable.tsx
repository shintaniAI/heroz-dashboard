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
  max = 15,
}: Props) {
  const sorted = [...rows]
    .sort((a, b) => numOr0(b.actual.value) - numOr0(a.actual.value))
    .slice(0, max);

  const maxActual = sorted.reduce(
    (m, r) => Math.max(m, numOr0(r.actual.value), numOr0(r.target.value)),
    1
  );

  const renderRow = (r: MediaRow, isTotal = false) => {
    const barPct = Math.max(
      0,
      Math.min(100, (numOr0(r.actual.value) / maxActual) * 100)
    );
    const p = r.progress.value;
    const tone =
      isFinite(p) && p >= 0.9
        ? "bg-ok"
        : isFinite(p) && p >= 0.6
        ? "bg-warn"
        : "bg-bad";
    const baseCls = isTotal
      ? "py-2.5 text-ink font-semibold bg-canvas/40"
      : "py-2.5 text-ink";
    return (
      <tr
        key={r.name + (isTotal ? "-total" : "")}
        className={`border-t border-line-soft ${isTotal ? "bg-canvas/40" : ""}`}
      >
        <td className={`${baseCls} pl-5`}>{r.name}</td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.target}
            spreadsheetId={spreadsheetId}
            display={num(r.target.value)}
            className="num text-ink-4"
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.genjiten}
            spreadsheetId={spreadsheetId}
            display={num(r.genjiten.value)}
            className="num text-ink-4"
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.actual}
            spreadsheetId={spreadsheetId}
            display={num(r.actual.value)}
            className={`num ${isTotal ? "text-ink font-bold" : "text-ink font-semibold"}`}
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.progress}
            spreadsheetId={spreadsheetId}
            display={pct(r.progress.value, 0)}
            className="num text-ink-2"
          />
        </td>
        <td className={`${baseCls} text-right`}>
          <Ref
            src={r.monthProgress}
            spreadsheetId={spreadsheetId}
            display={pct(r.monthProgress.value, 0)}
            className="num text-ink-3"
          />
        </td>
        <td className={`${baseCls} pr-5`}>
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
    <div className="panel p-5">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="label">Media</div>
          <h3 className="display-serif text-xl text-ink mt-1">{title}</h3>
        </div>
        <span className="label text-ink-muted">
          {rows.length}媒体 / Top {sorted.length}
        </span>
      </div>
      <div className="overflow-x-auto -mx-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="label text-ink-muted border-b border-line-soft">
              <th className="text-left pl-5 pb-2 font-semibold">媒体</th>
              <th className="text-right pb-2 font-semibold">月目標</th>
              <th className="text-right pb-2 font-semibold">現時点目標</th>
              <th className="text-right pb-2 font-semibold">実績</th>
              <th className="text-right pb-2 font-semibold">進捗率</th>
              <th className="text-right pb-2 font-semibold">月次進捗率</th>
              <th className="pr-5 pb-2 font-semibold w-24">達成</th>
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
