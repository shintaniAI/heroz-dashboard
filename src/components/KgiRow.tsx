import { pct, yen, numOr0 } from "@/lib/config";
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
  const target = numOr0(row.target.value);
  const actual = numOr0(row.actual.value);
  const genjiten = numOr0(row.genjiten.value);

  const vsTarget = target > 0 ? actual / target : NaN;
  const vsGenjiten = genjiten > 0 ? actual / genjiten : NaN;

  const tone = (v: number) =>
    isFinite(v) && v >= 0.95
      ? "ok"
      : isFinite(v) && v >= 0.8
      ? "warn"
      : "bad";

  const toneBar = {
    ok: "bg-ok",
    warn: "bg-warn",
    bad: "bg-bad",
  };
  const toneChip = {
    ok: "text-ok bg-ok-soft",
    warn: "text-warn bg-warn-soft",
    bad: "text-bad bg-bad-soft",
  };

  const genjitenTone = tone(vsGenjiten);
  const targetTone = tone(vsTarget);

  const progressPct = Math.max(0, Math.min(1, isFinite(vsTarget) ? vsTarget : 0));
  const genjitenPct = Math.max(
    0,
    Math.min(1, target > 0 ? genjiten / target : 0)
  );

  const diffCls = isFinite(row.diff.value)
    ? row.diff.value < 0
      ? "text-bad"
      : "text-ok"
    : "text-ink-3";

  return (
    <div className="panel p-2">
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <span className="label text-[10px] leading-tight truncate">{row.label}</span>
        <div className="flex items-center gap-1 shrink-0">
          <Ref
            src={row.monthProgress}
            spreadsheetId={spreadsheetId}
            display={pct(vsGenjiten, 0)}
            className={`num text-[10px] px-1 py-0.5 rounded ${toneChip[genjitenTone]} font-semibold leading-none`}
          />
          <span className="text-[8.5px] text-ink-muted leading-none">実÷現</span>
          <Ref
            src={row.progress}
            spreadsheetId={spreadsheetId}
            display={pct(vsTarget, 0)}
            className={`num text-[10px] px-1 py-0.5 rounded ${toneChip[targetTone]} font-semibold leading-none`}
          />
          <span className="text-[8.5px] text-ink-muted leading-none">実÷月</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <Ref
          src={row.actual}
          spreadsheetId={spreadsheetId}
          display={formatter(row.actual.value)}
          className={`num ${hero ? "text-2xl sm:text-3xl" : "text-lg"} font-semibold text-ink tracking-tight3 leading-none`}
        />
        <Ref
          src={row.diff}
          spreadsheetId={spreadsheetId}
          display={`${isFinite(row.diff.value) && row.diff.value >= 0 ? "+" : ""}${formatter(row.diff.value)}`}
          className={`num text-[10px] ${diffCls} leading-none`}
        />
      </div>

      <div className="mt-1.5 space-y-1">
        <div className="relative h-1 bg-line-soft rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-ink-muted/40"
            style={{ width: `${genjitenPct * 100}%` }}
          />
          <div
            className={`absolute inset-y-0 left-0 ${toneBar[targetTone]}`}
            style={{ width: `${progressPct * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2 text-[9.5px] text-ink-4 num leading-tight">
          <span className="truncate">
            月{" "}
            <Ref
              src={row.target}
              spreadsheetId={spreadsheetId}
              display={formatter(row.target.value)}
              className="text-ink-3"
            />
          </span>
          <span className="text-right truncate">
            現{" "}
            <Ref
              src={row.genjiten}
              spreadsheetId={spreadsheetId}
              display={formatter(row.genjiten.value)}
              className="text-ink-3"
            />
          </span>
        </div>
      </div>
    </div>
  );
}
