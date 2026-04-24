import { pct } from "@/lib/config";
import type { Sourced } from "@/lib/config";
import { Ref } from "./Ref";

type Props = {
  label: string;
  src?: Sourced;
  value: string;
  sub?: string;
  subSrc?: Sourced;
  subValue?: string;
  progress?: number;
  progressNote?: string;
  accent?: "ok" | "warn" | "bad" | "neutral" | "accent";
  spreadsheetId: string;
  hero?: boolean;
};

const chipClass: Record<NonNullable<Props["accent"]>, string> = {
  ok: "text-ok bg-ok-soft",
  warn: "text-warn bg-warn-soft",
  bad: "text-bad bg-bad-soft",
  accent: "text-accent bg-accent-soft",
  neutral: "text-ink-3 bg-canvas",
};

export function Kpi({
  label,
  src,
  value,
  sub,
  subSrc,
  subValue,
  progress,
  progressNote,
  accent = "neutral",
  spreadsheetId,
  hero = false,
}: Props) {
  return (
    <div className="panel p-2 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-1.5">
        <span className="label text-[10px] leading-tight">{label}</span>
        {progress !== undefined && (
          <div className="flex items-center gap-1 shrink-0">
            <span
              className={`num text-[10px] px-1 py-0.5 rounded ${chipClass[accent]} font-semibold leading-none`}
            >
              {pct(progress, 0)}
            </span>
            {progressNote && (
              <span className="text-[8.5px] text-ink-muted leading-none">{progressNote}</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-1.5">
        {src ? (
          <Ref
            src={src}
            spreadsheetId={spreadsheetId}
            display={value}
            className={`num ${hero ? "text-2xl sm:text-3xl" : "text-lg"} font-semibold text-ink tracking-tight3 leading-none`}
          />
        ) : (
          <span
            className={`num ${hero ? "text-2xl sm:text-3xl" : "text-lg"} font-semibold text-ink tracking-tight3 leading-none`}
          >
            {value}
          </span>
        )}
        {(sub || subSrc) && (
          <div className="text-[9.5px] text-ink-4 mt-1 num leading-tight">
            {sub}
            {subSrc && subValue && (
              <>
                {" "}
                <Ref
                  src={subSrc}
                  spreadsheetId={spreadsheetId}
                  display={subValue}
                  className="text-ink-3"
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
