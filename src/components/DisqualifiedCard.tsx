import { num, pct } from "@/lib/config";
import type { FailureRow } from "@/lib/dashboard-data";
import { Ref } from "./Ref";

type Props = {
  items: FailureRow[];
  totalMeetings: number;
  spreadsheetId: string;
};

const palette = ["bg-bad", "bg-bad/70", "bg-warn", "bg-warn/70"];

export function DisqualifiedCard({ items, totalMeetings, spreadsheetId }: Props) {
  const total = items.reduce((s, it) => s + it.actual.value, 0);

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="label">Conversion Loss</div>
          <h3 className="display-serif text-xl text-ink mt-1">失格内訳</h3>
        </div>
        <div className="text-right">
          <div className="num text-3xl font-semibold text-bad tracking-tight3 leading-none">
            {num(total)}
          </div>
          <div className="text-[11px] text-ink-4 mt-1 num">
            面談比 {totalMeetings > 0 ? pct(total / totalMeetings, 1) : "-"}
          </div>
        </div>
      </div>

      <div className="flex h-2 mb-5 bg-line-soft overflow-hidden rounded-sm">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={palette[i % palette.length]}
            style={{
              width: total > 0 ? `${(item.actual.value / total) * 100}%` : "0%",
            }}
          />
        ))}
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-2 h-2 rounded-sm ${palette[i % palette.length]}`}
              />
              <span className="text-sm text-ink-2">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[11px] text-ink-muted num">
                {total > 0 ? pct(item.actual.value / total, 0) : "-"}
              </span>
              <Ref
                src={item.actual}
                spreadsheetId={spreadsheetId}
                display={num(item.actual.value)}
                className="num text-sm font-semibold text-ink w-10 text-right inline-block"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
