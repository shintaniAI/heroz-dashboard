import { pct, yen } from "@/lib/config";
import type { KgiRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  row: KgiRow;
  spreadsheetId: string;
  hero?: boolean;
  formatter?: (n: number) => string;
};

export function KgiRowCard({
  row,
  spreadsheetId,
  hero = false,
  formatter = yen,
}: Props) {
  const tone =
    row.progress.value >= 0.9
      ? "ok"
      : row.progress.value >= 0.6
      ? "warn"
      : row.progress.value < 0 || row.actual.value < 0
      ? "bad"
      : "bad";

  const toneBar = {
    ok: "bg-ok",
    warn: "bg-warn",
    bad: "bg-bad",
  }[tone];

  const toneChip = {
    ok: "text-ok bg-ok-soft",
    warn: "text-warn bg-warn-soft",
    bad: "text-bad bg-bad-soft",
  }[tone];

  const achievement =
    row.genjiten.value > 0 ? row.actual.value / row.genjiten.value : 0;

  const progressPct = Math.max(
    0,
    Math.min(1, row.target.value > 0 ? row.actual.value / row.target.value : 0)
  );
  const genjitenPct = Math.max(
    0,
    Math.min(1, row.target.value > 0 ? row.genjiten.value / row.target.value : 0)
  );

  return (
    <div className="panel p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="label">{row.label}</span>
        <Ref
          src={row.progress}
          spreadsheetId={spreadsheetId}
          display={pct(row.progress.value, 0)}
          className={`num text-[11px] px-1.5 py-0.5 rounded ${toneChip} font-semibold`}
        />
      </div>

      <div className="flex items-baseline gap-2">
        <Ref
          src={row.actual}
          spreadsheetId={spreadsheetId}
          display={formatter(row.actual.value)}
          className={`num ${hero ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold text-ink tracking-tight3 leading-none`}
        />
      </div>

      <div className="mt-4 space-y-2">
        <div className="relative h-1 bg-line-soft rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-ink-muted/40"
            style={{ width: `${genjitenPct * 100}%` }}
          />
          <div
            className={`absolute inset-y-0 left-0 ${toneBar}`}
            style={{ width: `${progressPct * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-[10.5px] text-ink-4 num">
          <span>
            実績/目標{" "}
            <Ref
              src={row.target}
              spreadsheetId={spreadsheetId}
              display={formatter(row.target.value)}
              className="text-ink-3"
            />
          </span>
          <span>
            現時点目標{" "}
            <Ref
              src={row.genjiten}
              spreadsheetId={spreadsheetId}
              display={formatter(row.genjiten.value)}
              className="text-ink-3"
            />
          </span>
        </div>
        <div className="flex justify-between text-[10.5px] num">
          <span className="text-ink-4">
            差異{" "}
            <Ref
              src={row.diff}
              spreadsheetId={spreadsheetId}
              display={formatter(row.diff.value)}
              className={row.diff.value < 0 ? "text-bad" : "text-ok"}
            />
          </span>
          <span className="text-ink-4">
            現時点達成{" "}
            <span className={achievement >= 1 ? "text-ok" : "text-ink-3"}>
              {pct(achievement, 0)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
