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
    { label: "自社信販落ち", value: jishaShinpan, color: "bg-rose-500" },
    { label: "ブラック/生保", value: black, color: "bg-rose-400" },
    { label: "対応困難", value: taiouKonnan, color: "bg-amber-500" },
    { label: "未成年", value: miseinen, color: "bg-amber-400" },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-100 text-base">失格内訳</h3>
          <p className="text-xs text-slate-400 mt-0.5">商談に入れなかった要因</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-rose-300 tabular-nums">{num(total)}</div>
          <div className="text-[11px] text-slate-500">
            面談の {totalMeetings > 0 ? pct(total / totalMeetings, 1) : "-"}
          </div>
        </div>
      </div>

      <div className="flex h-2 rounded-full overflow-hidden bg-slate-800 mb-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={item.color}
            style={{ width: total > 0 ? `${(item.value / total) * 100}%` : "0%" }}
          />
        ))}
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-slate-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3 tabular-nums">
              <span className="text-xs text-slate-500">
                {total > 0 ? pct(item.value / total, 0) : "-"}
              </span>
              <span className="font-semibold text-white w-10 text-right">{num(item.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
