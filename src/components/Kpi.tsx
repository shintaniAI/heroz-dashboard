import { pct } from "@/lib/config";

type Props = {
  label: string;
  value: string;
  sub?: string;
  progress?: number;
  accent?: "ok" | "warn" | "bad" | "neutral" | "accent";
  hero?: boolean;
};

const chipClass: Record<NonNullable<Props["accent"]>, string> = {
  ok: "text-ok border-ok/40 bg-ok/10",
  warn: "text-warn border-warn/40 bg-warn/10",
  bad: "text-bad border-bad/40 bg-bad/10",
  accent: "text-accent border-accent/40 bg-accent/10",
  neutral: "text-ink-secondary border-line bg-surface-elevated",
};

const valueColor: Record<NonNullable<Props["accent"]>, string> = {
  ok: "text-ok",
  warn: "text-warn",
  bad: "text-bad",
  accent: "text-ink",
  neutral: "text-ink",
};

export function Kpi({
  label,
  value,
  sub,
  progress,
  accent = "neutral",
  hero = false,
}: Props) {
  return (
    <div className="card card-hover p-5 flex flex-col justify-between min-h-[128px]">
      <div className="flex items-center justify-between">
        <span className="label-caps">{label}</span>
        {progress !== undefined && (
          <span
            className={`num text-[10px] px-1.5 py-0.5 rounded border ${chipClass[accent]}`}
          >
            {pct(progress, 0)}
          </span>
        )}
      </div>
      <div className="mt-3">
        <div
          className={`num ${hero ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"} font-semibold tracking-tight3 leading-none ${accent === "ok" || accent === "warn" || accent === "bad" ? valueColor[accent] : "text-ink"}`}
        >
          {value}
        </div>
        {sub && <div className="text-xs text-ink-tertiary mt-2 num">{sub}</div>}
      </div>
    </div>
  );
}
