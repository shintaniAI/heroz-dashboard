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
    <div className="panel p-3 flex flex-col justify-between min-h-[96px]">
      <div className="flex items-center justify-between gap-2">
        <span className="label text-[10.5px]">{label}</span>
        {progress !== undefined && (
          <div className="flex items-center gap-1">
            <span
              className={`num text-[10.5px] px-1.5 py-0.5 rounded ${chipClass[accent]} font-semibold`}
            >
              {pct(progress, 0)}
            </span>
            {progressNote && (
              <span className="text-[9px] text-ink-muted">{progressNote}</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-2">
        {src ? (
          <Ref
            src={src}
            spreadsheetId={spreadsheetId}
            display={value}
            className={`num ${hero ? "text-2xl sm:text-3xl" : "text-xl"} font-semibold text-ink tracking-tight3 leading-none`}
          />
        ) : (
          <span
            className={`num ${hero ? "text-2xl sm:text-3xl" : "text-xl"} font-semibold text-ink tracking-tight3 leading-none`}
          >
            {value}
          </span>
        )}
        {(sub || subSrc) && (
          <div className="text-[10px] text-ink-4 mt-1.5 num">
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
