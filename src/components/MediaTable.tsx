import { num, pct } from "@/lib/config";
import type { MediaRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  title: string;
  rows: MediaRow[];
  spreadsheetId: string;
  max?: number;
};

export function MediaTable({ title, rows, spreadsheetId, max = 15 }: Props) {
  const sorted = [...rows]
    .sort((a, b) => b.actual.value - a.actual.value)
    .slice(0, max);

  const maxActual = sorted.reduce(
    (m, r) => Math.max(m, r.actual.value, r.target.value),
    1
  );

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
              <th className="text-right pb-2 font-semibold">目標</th>
              <th className="text-right pb-2 font-semibold">現時点</th>
              <th className="text-right pb-2 font-semibold">実績</th>
              <th className="text-right pb-2 font-semibold">進捗</th>
              <th className="pr-5 pb-2 font-semibold w-28">達成</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => {
              const barPct = Math.max(
                0,
                Math.min(100, (r.actual.value / maxActual) * 100)
              );
              const tone =
                r.progress.value >= 0.9
                  ? "bg-ok"
                  : r.progress.value >= 0.6
                  ? "bg-warn"
                  : "bg-bad";
              return (
                <tr key={r.name} className="border-t border-line-soft">
                  <td className="py-2.5 pl-5 text-ink-2">{r.name}</td>
                  <td className="py-2.5 text-right">
                    <Ref
                      src={r.target}
                      spreadsheetId={spreadsheetId}
                      display={num(r.target.value)}
                      className="num text-ink-4"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <Ref
                      src={r.genjiten}
                      spreadsheetId={spreadsheetId}
                      display={num(r.genjiten.value)}
                      className="num text-ink-4"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <Ref
                      src={r.actual}
                      spreadsheetId={spreadsheetId}
                      display={num(r.actual.value)}
                      className="num text-ink font-semibold"
                    />
                  </td>
                  <td className="py-2.5 text-right">
                    <Ref
                      src={r.progress}
                      spreadsheetId={spreadsheetId}
                      display={pct(r.progress.value, 0)}
                      className="num text-ink-2"
                    />
                  </td>
                  <td className="py-2.5 pr-5">
                    <div className="h-1.5 bg-line-soft rounded-full overflow-hidden">
                      <div
                        className={`h-full ${tone}`}
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
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
