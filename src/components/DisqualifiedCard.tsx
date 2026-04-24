import { num, pct } from "@/lib/config";

type Props = {
  jishaShinpan: number;
  black: number;
  taiouKonnan: number;
  miseinen: number;
  total: number;
  totalMeetings: number;
};

export function DisqualifiedCard({
  jishaShinpan,
  black,
  taiouKonnan,
  miseinen,
  total,
  totalMeetings,
}: Props) {
  const items = [
    { label: "自社信販落ち", value: jishaShinpan, bar: "bg-bad" },
    { label: "ブラック / 生保", value: black, bar: "bg-bad/75" },
    { label: "対応困難", value: taiouKonnan, bar: "bg-warn" },
    { label: "未成年", value: miseinen, bar: "bg-warn/75" },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="label-caps text-ink-secondary">Disqualified</div>
          <h3 className="text-base font-semibold text-ink mt-1">失格内訳</h3>
        </div>
        <div className="text-right">
          <div className="num text-3xl font-semibold text-bad tracking-tight3 leading-none">
            {num(total)}
          </div>
          <div className="text-[11px] text-ink-tertiary mt-1 num">
            面談の {totalMeetings > 0 ? pct(total / totalMeetings, 1) : "-"}
          </div>
        </div>
      </div>

      <div className="flex h-1 mb-4 bg-line overflow-hidden rounded-sm">
        {items.map((item) => (
          <div
            key={item.label}
            className={item.bar}
            style={{ width: total > 0 ? `${(item.value / total) * 100}%` : "0%" }}
          />
        ))}
      </div>

      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-sm ${item.bar}`} />
              <span className="text-sm text-ink-secondary">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-[11px] text-ink-muted num">
                {total > 0 ? pct(item.value / total, 0) : "-"}
              </span>
              <span className="num text-sm font-semibold text-ink w-10 text-right">
                {num(item.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
