import { num, pct, numOr0 } from "@/lib/config";
import type { FailureRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  items: FailureRow[];
  totalMeetings: number;
  spreadsheetId: string;
};

const palette = ["bg-bad", "bg-bad/70", "bg-warn", "bg-warn/70"];

export function DisqualifiedCard({ items, totalMeetings, spreadsheetId }: Props) {
  const total = items.reduce((s, it) => s + numOr0(it.actual.value), 0);

  return (
    <div className="panel p-2">
      <div className="flex items-baseline justify-between mb-1.5">
        <h3 className="display-serif text-sm text-ink leading-tight">失格内訳</h3>
        <div className="flex items-baseline gap-1.5">
          <span className="num text-base font-semibold text-bad tracking-tight3 leading-none">
            {num(total)}
          </span>
          <span className="text-[9.5px] text-ink-4 num">
            面談比 {totalMeetings > 0 ? pct(total / totalMeetings, 1) : "-"}
          </span>
        </div>
      </div>

      <div className="flex h-1.5 mb-1.5 bg-line-soft overflow-hidden rounded-sm">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={palette[i % palette.length]}
            style={{
              width: total > 0 ? `${(numOr0(item.actual.value) / total) * 100}%` : "0%",
            }}
          />
        ))}
      </div>

      <div className="space-y-0.5">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-sm ${palette[i % palette.length]}`}
              />
              <span className="text-[11px] text-ink-2 truncate">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[9.5px] text-ink-muted num">
                {total > 0 ? pct(numOr0(item.actual.value) / total, 0) : "-"}
              </span>
              <Ref
                src={item.actual}
                spreadsheetId={spreadsheetId}
                display={num(item.actual.value)}
                className="num text-[11px] font-semibold text-ink w-8 text-right inline-block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
