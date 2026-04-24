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
  accent = "neutral",
  spreadsheetId,
  hero = false,
}: Props) {
  return (
    <div className="panel p-5 flex flex-col justify-between min-h-[120px]">
      <div className="flex items-center justify-between">
        <span className="label">{label}</span>
        {progress !== undefined && (
          <span
            className={`num text-[11px] px-1.5 py-0.5 rounded ${chipClass[accent]} font-semibold`}
          >
            {pct(progress, 0)}
          </span>
        )}
      </div>
      <div className="mt-3">
        {src ? (
          <Ref
            src={src}
            spreadsheetId={spreadsheetId}
            display={value}
            className={`num ${hero ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold text-ink tracking-tight3 leading-none`}
          />
        ) : (
          <span
            className={`num ${hero ? "text-3xl sm:text-4xl" : "text-2xl"} font-semibold text-ink tracking-tight3 leading-none`}
          >
            {value}
          </span>
        )}
        {(sub || subSrc) && (
          <div className="text-[11px] text-ink-4 mt-2 num">
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
